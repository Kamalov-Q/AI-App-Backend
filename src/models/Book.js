import mongoose from "mongoose";
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Books", bookSchema);

export default Book;
