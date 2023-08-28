// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cors from "cors";
import jsdom from "jsdom";
import serveStatic from "serve-static";
import "../web/database/config.js";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import fetch from "node-fetch";

import {
  billingConfig,
  createUsageRecord,
  getAppSubscription,
} from "./billing.js";
import addStore, {
  updateAppStatus,
  updateHtml,
} from "./model/Controller/store.js";
import Stores from "./model/Stores.js";
import { addProduct } from "./Product/product.js";
import metafield, { metafield2 } from "./metafieldsConfig.js";
import EI from "./routes/exportImportPro.js";
import fileUpload from "express-fileupload";
import { toASCII } from "punycode";
import { Session } from "inspector";

const addSessionShopToReqParams = (req, res, next) => {
  const shop = res.locals?.shopify?.session?.shop;
  if (shop && !req.query.shop) {
    req.query.shop = shop;
  }
  console.log("SHOP:", shop, req.query.shop);
  return next();
};

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

async function customDataMetafields(session) {
  // const client = new shopify.api.clients.Rest({ session });
  const client = new shopify.api.clients.Graphql({ session });
  // const client = new shopify.clients.Graphql({session});
  const data = await client.query({
    data: {
      query: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
              namespace
              key
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
      variables: {
        definition: metafield.definition,
      },
    },
  });

  const data2 = await client.query({
    data: {
      query: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
              namespace
              key
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
      variables: {
        definition: metafield2.definition,
      },
    },
  });
  return data;
}
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  // Request payment if required
  async (req, res, next) => {
    const plans = Object.keys(billingConfig);
    const session = res.locals.shopify.session;
    const hasPayment = await shopify.api.billing.check({
      session,
      plans: plans,
      isTest: true,
    });
    await addStore(session.shop, session.accessToken);
    await addProduct(session);
    console.log("start checking has payment=>", hasPayment);
    if (hasPayment) {
      next();
    } else {
      const billingResponse = await shopify.api.billing.request({
        session,
        plan: plans[0],
        isTest: true,
        returnObject: true,
      });
      console.log("start billingResponse=>", billingResponse);
      const subscriptionLineItem = await getAppSubscription(session);
      await customDataMetafields(session);
      console.log("start subid=>", subscriptionLineItem);
      res.redirect(billingResponse.confirmationUrl);
    }
  },
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);
// app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const getMeta = async (session, id) => {
  const products = await shopify.api.rest.Metafield.all({
    session,
    metafield: {
      owner_id: id,
      owner_resource: "variants",
    },
  });
  const co2footprints = products.data?.find((x) => x.key === "co2");
  const co2compensation = products.data?.find(
    (x) => x.key === "co2compensation"
  );
  console.log("metafield data=>", co2footprints, co2compensation);
  if (co2compensation) {
    return Number(JSON.parse(co2compensation?.value).amount);
  }
  return 0;
  // const Endpoint = `${shop}/admin/api/2023-07/products/${id}/metafields.json`;
  // const MetaData = async (Endpoint) => {
  //   try {
  //     const response = await fetch(Endpoint, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-Shopify-Access-Token": `${accessToken}`,
  //       },
  //     });

  //     const result = await response.json();

  //     if (result.errors) {
  //       throw new Error(
  //         `Failed to Fetch Metafield Value for ${shop_name}: ${JSON.stringify(
  //           result.errors
  //         )}`
  //       );
  //     }

  //     return result.metafields;
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  // };
};

const getVariant = async (session, id, cartPrice) => {
  const product = await shopify.api.rest.Product.find({
    session: session,
    id: id,
  });

  function findClosestVariant(variants) {
    let closestVariant = null;
    let closestDifference = Infinity;
    const mainPrice = cartPrice;
    if (cartPrice != 0) {
      for (const variant of variants) {
        const price = variant.price;
        const difference = Math.abs(price - mainPrice);

        if (difference < closestDifference) {
          closestDifference = difference;
          closestVariant = variant;
        }
      }
    }
    return closestVariant;
  }

  const closestVariant = findClosestVariant(product?.variants);
  console.log("Closest Variant:", closestVariant);
  return closestVariant;
};

app.post("/api/getAppStatus", async (req, res) => {
  // const session = res.locals.shopify.session;
  res.setHeader("Access-Control-Allow-Origin", `*`);
  const shop = req.query.shop;
  const ids = req.body.ids;
  const responseBody = {
    appStatus: false,
    html: "",
    price: 0,
    productId: "",
    id: "",
    cartVariantId: "",
    status: 400,
  };
  console.log("extension running", shop, ids);
  try {
    const findShop = await Stores.findOne({ storename: shop });
    // console.log(findShop);
    responseBody.appStatus = findShop?.appStatus;
    const session = {
      shop: findShop?.storename,
      accessToken: findShop?.storetoken,
    };
    let total = 0;
    // get meta data Price
    for (const productId in ids) {
      console.log("==>", productId);
      //-------------------
      const price = await getMeta(session, productId);
      console.log(price);
      total += price * ids[productId];
    }
    // updating checkbox price in html
    const dom = new jsdom.JSDOM(findShop?.html);
    const element = dom.window.document.querySelector(".check_custom span");
    if (element) {
      element.innerHTML = "{price}";
    }
    // getting variant to add in cart
    const cartVariant = await getVariant(session, findShop.productId, total);
    // creating response body
    if (findShop?.appStatus) {
      responseBody.status = 200;
      responseBody.html = dom.serialize();
      responseBody.design = findShop.design;
      responseBody.id = findShop.productId;
      responseBody.cartVariant = cartVariant;
      responseBody.price = cartVariant?.price;
      responseBody.cartVariantId = cartVariant?.id;
      responseBody.prop = cartVariant?.title;
    }

    res.status(200).json(responseBody);
    return;
  } catch (error) {
    console.log(error);
    responseBody.status = 400;
    res.status(400).json(responseBody);
    return;
  }
});

// Create Usage Records
app.get("/api/usage", async (_req, res) => {
  console.log("hitted", _req.query.shop);

  // let status = 200;
  // let error = null;
  // let resp = null;
  // let capacityReached = false;
  // let session = {
  //   shop: shop,
  //   accessToken: ''
  // }

  // try {
  //   const findShop = await Stores.findOne({ storename: shop });
  //   session.accessToken = findShop?.storetoken;
  //   console.log("session=>", session)
  //   resp = await createUsageRecord(session);
  //   capacityReached = resp.capacityReached;
  //   if (capacityReached && !resp.createdRecord) {
  //     error = "Could not create record because capacity was reached";
  //     status = 400;
  //   }
  // } catch (e) {
  //   console.log(`Failed to process usage/create: ${e.message}`);
  //   status = 500;
  //   error = e.message;
  // }
  // res
  //   .status(status)
  //   .send({ success: status === 200, capacityReach: capacityReached, error });
  res.status(200);
});

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/*", addSessionShopToReqParams);

// // Create Usage Records
// app.get("/api/usage", async (_req, res) => {
//   console.log('hitted')
//   // res.setHeader("Access-Control-Allow-Origin", `*`);
//   let status = 200;
//   let error = null;
//   let resp = null;
//   let capacityReached = false;

//   try {
//     resp = await createUsageRecord(res.locals.shopify.session);
//     capacityReached = resp.capacityReached;
//     if (capacityReached && !resp.createdRecord) {
//       error = "Could not create record because capacity was reached";
//       status = 400;
//     }
//   } catch (e) {
//     console.log(`Failed to process usage/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res
//     .status(status)
//     .send({ success: status === 200, capacityReach: capacityReached, error });
//   // res.status(200)
// });

// Change App Status

app.use("/api", EI);
app.get("/api/appStatus", async (_req, res) => {
  let status = 200;
  let error = null;
  let appStatus = _req.query.status;
  try {
    console.log("App Status hit=>", appStatus);
    updateAppStatus(res.locals.shopify.session.shop, appStatus);
  } catch (e) {
    console.log(`Failed to Change app status: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(200).send({ status: status === 200, error });
});

// Save Html
app.post("/api/saveHtml", async (_req, res) => {
  let status = 200;
  let error = null;
  const html = _req.body.html;
  const design = _req.body.design;
  try {
    updateHtml(res.locals.shopify.session.shop, html, design);
  } catch (e) {
    console.log(`Failed to Change app status: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(200).send({ status: status === 200, error });
});

// Get all details of store and blocks
app.get("/api/getStoreData", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const session = res.locals.shopify.session;
    let findshop;
    // check if app is installing for first time
    findshop = await Stores.findOne({
      storename: session.shop,
    });
    if (findshop == null || findshop == undefined) {
      findshop = await addStore(session.shop, session.accessToken);
    }
    // console.log("StoreData=> ", findshop)

    res.status(200).json({ status: 200, data: findshop });
  } catch (err) {
    console.log(err);
    res.status(200).json({ status: 400, Error: err });
  }
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
