import { Router } from "express";
import upload from "../lib/imageUpload.js";
import { createBook, uploadImage } from "../controllers/books.controller.js";

const router = Router();

router.post("/upload", upload.single("imageUrl"), uploadImage);
router.post("/", createBook);

export default router;
