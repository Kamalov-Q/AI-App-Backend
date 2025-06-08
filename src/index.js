import express from "express";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import bookRouter from "./routes/books.routes.js";
import { connectDb } from "./lib/db.js";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.config.js";
const app = express();

const PORT = process.env.PORT || 3001;

// middleware to parse json
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", async (_, res) => {
  res.status(200).json({
    message: `Server is running! Swagger docs: http://localhost:${PORT}/api-docs`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  connectDb();
});
