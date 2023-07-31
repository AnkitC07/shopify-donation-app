import express from "express";
import { exportProducts } from "../controller/exportImportPro.js";

const app = express();
const EI = express.Router();

EI.get('/export_products',exportProducts);

export default EI;