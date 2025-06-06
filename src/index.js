import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import { connectDb } from "./lib/db.js";
const app = express();

const PORT = process.env.PORT || 5000;

// middleware to parse json
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDb();
});
