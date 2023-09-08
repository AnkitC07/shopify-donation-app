import express from "express";
import asyncHandler from "express-async-handler";
import { getOrdersSuper, getStatsSuper } from "../controller/analytics.js";

const app = express();
const analyticRouter = express.Router();

analyticRouter.get("/analytics/super", asyncHandler(getOrdersSuper));
analyticRouter.get("/analytics/stats/super", asyncHandler(getStatsSuper));

export default analyticRouter;
