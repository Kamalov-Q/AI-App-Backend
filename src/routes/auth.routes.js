import { Router } from "express";
const authRouter = Router();
import { login, signUp } from "../controllers/auth.controller.js";

authRouter.post("/login", login);
authRouter.post("/sign-up", signUp);

export default authRouter;
