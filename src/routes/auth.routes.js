import { Router } from "express";
const authRouter = Router();
import { deleteUser, getAllUsers, getCurrentUser, login, signUp } from "../controllers/auth.controller.js";
import { authentificateUser } from "../../middlewares/authentificate.middleware.js";
import { authorizeUser } from "../../middlewares/authorization.middleware.js";

authRouter.post("/login", login);
authRouter.post("/sign-up", signUp);
authRouter.get("/", authentificateUser, authorizeUser(["admin"]), getAllUsers);
authRouter.get("/user", authentificateUser, authorizeUser(["admin"]), getCurrentUser);
authRouter.delete("/:id", authentificateUser, authorizeUser(["admin"]), deleteUser);

export default authRouter;
