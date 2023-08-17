import express from "express";
import Cors from "cors";
import User from "./routes/User.js";
import { customAuth } from "./middleware/auth.js";

const app = express();
app.use(express.json())
app.use(Cors())
const PORT = 8009

app.use("/api", User)

app.get("/api/checkuser", customAuth, async (req, res) => {
    console.log("logged in")
    const token = req.headers["api-token"];
    res.status(200).json({ user: req.user, token })
})


app.listen(PORT, () => {
    console.log("running on port " + PORT)
})

