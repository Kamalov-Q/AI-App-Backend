import { Router } from "express";
import upload from "../lib/imageUpload.js";
import { createBook, uploadImage } from "../controllers/books.controller.js";
import { authentificateUser } from "../../middlewares/authentificate.middleware.js";

const router = Router();

router.post("/upload", upload.single("imageUrl"), uploadImage);
router.post("/", authentificateUser, createBook);

export default router;
