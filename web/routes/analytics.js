import express from "express";
import fetch from "node-fetch";
import asyncHandler from "express-async-handler";
import {
  getOrders,
  getOrdersSuper,
  getStats,
  getStatsSuper,
} from "../controller/analytics.js";

const app = express();
const analyticRouter = express.Router();

analyticRouter.get("/analytics", asyncHandler(getOrders));
// analyticRouter.get("/analytics/super", asyncHandler(getOrdersSuper));
analyticRouter.get("/analytics/stats", asyncHandler(getStats));
// analyticRouter.get("/analytics/stats/super", asyncHandler(getStatsSuper));

export default analyticRouter;
