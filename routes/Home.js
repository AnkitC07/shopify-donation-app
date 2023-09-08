import express from "express";
import asyncHandler from "express-async-handler";
import { getHomeData } from "../controller/home.js";

const app = express();
const homeRouter = express.Router();

homeRouter.get("/home", asyncHandler(getHomeData));

export default homeRouter;
