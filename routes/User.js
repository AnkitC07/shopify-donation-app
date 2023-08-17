import express from "express";
import { Login  } from "../controller/user.js";


const app = express();
const User = express.Router();

User.post("/login", Login);

export default User;
