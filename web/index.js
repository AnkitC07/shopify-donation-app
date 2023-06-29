// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cors from 'cors'
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { billingConfig, createUsageRecord } from "./billing.js";


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

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

    if (hasPayment) {
      next();
    } else {
      res.redirect(
        await shopify.api.billing.request({
          session,
          plan: plans[0],
          isTest: true,
        }),
      );
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



// app.get("/api/usage/create", async (_req, res) => {
//   let status = 200;
//   let error = null;
//   let resp = null;
//   let capacityReached = false;

//   try {
//     res.setHeader("Access-Control-Allow-Origin", `*`);
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
// });

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());


// Create Usage Records




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
