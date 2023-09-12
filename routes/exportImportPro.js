import express from "express";
import { exportOrders } from "../controller/exportImportPro.js";

const EI = express.Router();

//Analytic
EI.get("/exportOrders", exportOrders);

export default EI;
