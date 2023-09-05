import express from "express";
import fetch from "node-fetch";
import asyncHandler from "express-async-handler";
import { getOrders } from "../controller/analytics.js";

const app = express();
const analyticRouter = express.Router();

analyticRouter.get("/analytics", asyncHandler(getOrders));

export default analyticRouter;
