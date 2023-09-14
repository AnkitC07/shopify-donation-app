import express from "express";
import asyncHandler from "express-async-handler";
import { getBilling } from "../controller/billingController.js";

const billingRouter = express.Router();

billingRouter.get("/get-billing", asyncHandler(getBilling));

export default billingRouter;
