import mongoose from "mongoose";
import Book from "../models/Book.js";
import path from "path"
import fs from "fs"

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

    const existingBook = await Book.findOne({ title, isDeleted: false });

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

    const newBook = await Book.findById(book?._id).populate("author", "username email profileImg").select("-isDeleted");

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
    const books = await Book.find({ isDeleted: false }).populate("author", "username email profileImg").select("-isDeleted -deletedBy -deletedAt").sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalBooks = await Book.countDocuments({ isDeleted: false });
    return res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      count: books.length,
      currentPage: page,
      message: "Books fetched successfully"
    });
  } catch (error) {
    console.error(`Error while getting all books: ${error}`);
    return res
      .status(500)
      .json({ message: `Internal server error : ${error}` });
  }
}

//Admin role only to see all data !!!
export const getAllBooksByAdmin = async (req, res) => {
  try {

    const books = await Book.find({}).populate("author", "username email profileImg").populate("deletedBy", "username email profileImg").sort({ createdAt: -1 });
    return res.status(200).json({ books, message: "Books fetched successfully", count: books.length });

  } catch (error) {
    console.error(`Error while getting all books by admin: ${error}`);
    return res.status(500).json({ message: `Internal server error : ${error}` });
  }
}

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ author: req.user._id, isDeleted: false }).populate("author", "username email profileImg");
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

export const deleteBookByOwner = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { role, _id: userId } = req.user;
    if (!mongoose.Types.ObjectId.isValid(bookId) || !bookId) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const existingBook = await Book.findOne({ _id: bookId, isDeleted: false });
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { author } = existingBook
    const isOwner = String(author) === String(userId);
    const isAdmin = role === "admin"

    if (!isAdmin || !isOwner) {
      return res.status(403).json({ message: `You are not authorized to delete this book! Because book owner is  : ${existingBook.author}` });
    }

    //Attempt to delete image file from disk
    const { imageUrl } = existingBook
    if (imageUrl) {
      const imagePath = path.join("uploads", path.basename(imageUrl));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting image file : `, err?.message);
        } else {
          console.log(`Image deleted successfully`, imagePath);
        }
      })
    }

    const updatedData = {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user._id
    }

    const deletedBook = await Book.findOneAndUpdate({ _id: bookId }, updatedData, { new: true }).select("-deletedBy -deletedAt -isDeleted").populate("author", "username email profileImg");
    return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });


  } catch (error) {
    console.error(`Error while deleting book by owner: ${error}`);
    return res.status(500).json({ message: `Internal server error : ${error}` });
  }
}

export const deleteBooks = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id) || !id) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const existingBook = await Book.findOne({ _id: id, isDeleted: false });
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedData = {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user._id
    }

    const deletedBook = await Book.findOneAndUpdate({ _id: id }, updatedData, { new: true }).populate("deletedBy", "username email profileImg");

    return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });

  } catch (error) {
    console.error(`Error while deleting books: ${error}`);
    return res.status(500).json({ message: `Internal server error : ${error}` });
  }
}