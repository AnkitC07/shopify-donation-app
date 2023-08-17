import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import users from "../credentials/mockData.js";

const customAuth = async (req, res, next) => {
  try {
    const token = req.headers["api-token"];
    if (token) {
      const decode = jwt.verify(token, "123456789");
      const userData = users.find(u => u.email === decode.email && u.password === decode.password);
      if (userData) {
        req.user = userData
        next();
      } else {
        res.status(401);
        throw new Error("User is not authorized");
      }
    } else {
      res.status(401);
      throw new Error("User is not authorized");
    }
  } catch (error) {
    res.status(400).json({ error: error })
    console.log("error-------------------", error)
  }
}

export { customAuth };
