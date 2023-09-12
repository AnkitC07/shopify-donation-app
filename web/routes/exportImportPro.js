import express from "express";
import {
  exportOrders,
  exportProducts,
  importProducts,
} from "../controller/exportImportPro.js";

const app = express();
const EI = express.Router();

EI.get("/export_products", exportProducts);
EI.post("/import_products", importProducts);
//Analytic
EI.get("/exportOrders", exportOrders);

export default EI;
