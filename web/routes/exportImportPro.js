import express from "express";
import {
  exportProducts,
  importProducts,
} from "../controller/exportImportPro.js";

const app = express();
const EI = express.Router();

EI.get("/export_products", exportProducts);
EI.post("/import_products", importProducts);

export default EI;
