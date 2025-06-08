import Book from "../models/Book.js";

/**
 * @swagger
 * /books/upload:
 *   post:
 *     summary: Upload an image for a book
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *                 example: "(binary image file)"
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image uploaded successfully"
 *                 imageUrl:
 *                   type: string
 *                   example: "http://localhost:3000/uploads/abc123.jpg"
 *       422:
 *         description: Image is required
 *       500:
 *         description: Internal server error
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(422).json({ message: "Image is required" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename
      }`;

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error(`Error while uploading image: ${error}`);
    return res.status(500).json({ message: `Internal server error: ${error}` });
  }
};

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - caption
 *               - rating
 *               - imageUrl
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Gatsby"
 *               caption:
 *                 type: string
 *                 example: "A classic novel set in the Jazz Age."
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               imageUrl:
 *                 type: string
 *                 description: URL of the uploaded image
 *                 example: "http://localhost:3000/uploads/abc123.jpg"
 *               author:
 *                 type: string
 *                 example: "F. Scott Fitzgerald"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book created successfully"
 *                 book:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "The Great Gatsby"
 *                     caption:
 *                       type: string
 *                       example: "A classic novel set in the Jazz Age."
 *                     rating:
 *                       type: number
 *                       example: 4.5
 *                     imageUrl:
 *                       type: string
 *                       example: "http://localhost:3000/uploads/abc123.jpg"
 *                     author:
 *                       type: string
 *                       example: "F. Scott Fitzgerald"
 *       422:
 *         description: All fields are required
 *       500:
 *         description: Internal server error
 */
export const createBook = async (req, res) => {
  try {
    const { title, caption, rating, imageUrl } = req.body;

    if (!title || !caption || !rating || !imageUrl) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const existingBook = await Book.findOne({ title });

    if (existingBook) {
      return res.status(409).json({ message: "Book already exists" });
    }

    const book = await Book.create({
      title,
      caption,
      rating,
      imageUrl,
      author: req.user._id,
    })

    const newBook = await Book.findById(book?._id).populate({
      path: "author",
      select: "username email profileImg",
    });

    return res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(`Error while creating book: ${error}`);
    return res
      .status(500)
      .json({ message: `Internal server error : ${error}` });
  }
};
