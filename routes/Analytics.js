import express from "express";
import asyncHandler from "express-async-handler";
import {
  getOrdersSuper,
  getSession,
  getStatsSuper,
} from "../controller/analytics.js";
import shopify from "../shopify.js";

const app = express();
const analyticRouter = express.Router();

analyticRouter.get("/analytics/test", async (req, res) => {
  const shop = req.query.shop;
  const session = await getSession(shop);
  try {
    const client = new shopify.api.clients.Rest({ session });
    const data = await client.get({
      path: "orders",
      query: { status: "any" },
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ data: "", session });
});

analyticRouter.get("/analytics/super", asyncHandler(getOrdersSuper));
analyticRouter.get("/analytics/stats/super", asyncHandler(getStatsSuper));

export default analyticRouter;
