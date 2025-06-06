import { Router } from "express";
const authRouter = Router();
import { signUp } from "../controllers/auth.controller.js";

authRouter.get("/login", async (req, res) => {
  res.status(200).json({ message: "Login successful" });
});
authRouter.post("/sign-up", signUp);

export default authRouter;
