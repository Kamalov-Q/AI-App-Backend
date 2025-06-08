import { Router } from "express";
import upload from "../lib/imageUpload.js";
import { createBook, deleteBooks, getAllBooks, getBooksByUser, uploadImage } from "../controllers/books.controller.js";
import { authentificateUser } from "../../middlewares/authentificate.middleware.js";
const router = Router();

router.post("/upload", upload.single("imageUrl"), uploadImage);
router.post("/", authentificateUser, createBook);
router.get("/", authentificateUser, getAllBooks);
router.get("/user", authentificateUser, getBooksByUser);
router.delete("/:id", authentificateUser, deleteBooks);
export default router;
