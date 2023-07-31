// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cors from "cors";
import serveStatic from "serve-static";
import "../web/database/config.js";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import {
  billingConfig,
  createUsageRecord,
  getAppSubscription,
} from "./billing.js";
import addStore from "./model/Controller/store.js";
import Stores from "./model/Stores.js";
import metafield from "./metafieldsConfig.js";
import EI from "./routes/exportImportPro.js";

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
      query:
        `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
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
    addStore(session.shop, session.accessToken);
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
// app.use(cors())

// Create Usage Records
app.get("/api/usage", async (_req, res) => {
  console.log("hitted", _req.query.shop);

  res.setHeader("Access-Control-Allow-Origin", `*`);
  const shop = _req.query.shop;
  let status = 200;
  let error = null;
  let resp = null;
  let capacityReached = false;
  let session = {
    shop: shop,
    accessToken: "",
  };

  try {
    const findShop = await Stores.findOne({ storename: shop });
    session.accessToken = findShop?.storetoken;
    console.log("session=>", session);
    resp = await createUsageRecord(session);
    capacityReached = resp.capacityReached;
    if (capacityReached && !resp.createdRecord) {
      error = "Could not create record because capacity was reached";
      status = 400;
    }
  } catch (e) {
    console.log(`Failed to process usage/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res
    .status(status)
    .send({ success: status === 200, capacityReach: capacityReached, error });
  // res.status(200)
});

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

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

app.use('/api',EI)
app.get("/api/appStatus", async (_req, res) => {
  let status = 200;
  let error = null;
  let appStatus = _req.body;
  try {
    console.log("app status hit", appStatus);
  } catch (e) {
    console.log(`Failed to Change app status: ${e.message}`);
    status = 500;
    error = e.message;
  }

  res.status(200).send({ status: status === 200, error });
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
