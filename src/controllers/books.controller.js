import mongoose from "mongoose";
import Book from "../models/Book.js";


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
    });

    const newBook = await Book.findById(book?._id).populate("author", "username email profileImg");

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

//pagination infinite scroll
export const getAllBooks = async (req, res) => {
  try {
    const { page: _pg, limit: _lm } = req.query
    const page = _pg || 1;
    const limit = _lm || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find().populate("author", "username email profileImg").sort({ createdAt: -1 }).skip(skip).limit(limit);
    return res.status(200).json({
      books, count: books.length
      , message: "Books fetched successfully"
    });
  } catch (error) {
    console.error(`Error while getting all books: ${error}`);
    return res
      .status(500)
      .json({ message: `Internal server error : ${error}` });
  }
}

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ author: req.user._id }).populate("author", "username email profileImg");
    return res.status(200).json({ books, message: "Books fetched successfully", count: books.length });
  } catch (error) {
    console.error(`Error while getting books by user: ${error}`);
    return res
      .status(500)
      .json({ message: `Internal server error : ${error}` });
  }
}

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, author, imageUrl, caption, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      return res.status(422).json({ message: "Invalid book id" });
    }

    const updatedBook = {};
    if (title) updatedBook.title = title;
    if (author) updatedBook.author = author;
    if (imageUrl) updatedBook.imageUrl = imageUrl
    if (caption) updatedBook.caption = caption
    if (rating) updatedBook.rating = rating

    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" })
    }

    const updBook = await Book.findByIdAndUpdate(id, updatedBook, { new: true });
    return res.status(200).json({ message: "Book updated successfully", book: updBook });

  } catch (error) {
    console.error(`Error while updating book: ${error}`);
    return res
      .status(500)
      .json({ message: `Internal server error : ${error}` });
  }
}

export const deleteBooks = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });

  } catch (error) {
    console.error(`Error while deleting books: ${error}`);
    return res.status(500).json({ message: `Internal server error : ${error}` });
  }
}