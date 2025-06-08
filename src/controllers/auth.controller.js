import User from "../models/User.js";
import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/bcrypt.hash.js";
import { generateToken } from "../utils/generateToken.js";
import Book from "../models/Book.js";


export const signUp = async (req, res) => {
  try {
    const { email, username, password: _pw } = req.body;

    if (!email || !username || !_pw) {
      return res.status(422).json({ message: "All fields are required" });
    }

    if (String(_pw).length < 6) {
      return res
        .status(422)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (String(username).length < 3 || String(username).trim() == "") {
      return res
        .status(422)
        .json({ message: "Name must be at least 3 characters" });
    }

    const password = await hashPassword(_pw);

    if (!email.includes("@")) {
      return res.status(422).json({ message: "Email must be valid" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const profileImg = `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${username}`;

    const newUser = new User({
      email,
      username,
      password,
      profileImg
    });

    const user = await newUser.save();

    const token = generateToken(user?._id);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        profileImg: user?.profileImg ? user?.profileImg : profileImg,
        role: user?.role,
        isDeleted: user?.isDeleted
      },
      token,
    });
  } catch (error) {
    console.error(`Error while signing up: ${error}`);
    return res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user, "user");

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user?._id);

    console.log(token, "token");

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        profileImg: user?.profileImg,
        role: user?.role ? user?.role : "user",
        isDeleted: user?.isDeleted
      },
      token,
    });
  } catch (error) {
    console.error(`Error while logging in: ${error}`);
    return res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate("deletedBy", "username email profileImg");

    return res.status(200).json({ users, message: "Users fetched successfully", count: users.length });
  } catch (error) {
    console.error(`Error while getting all users: ${error}`);
    return res.status(500).json({ message: `Internal Server Error : ${error}` });

  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const delId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const existingUser = await User.findById(userId);

    if (!existingUser || existingUser.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }

    //Perform soft delete
    existingUser.isDeleted = true;
    existingUser.deletedAt = new Date();
    existingUser.deletedBy = delId;
    (await existingUser.save()).populate("deletedBy", "username email profileImg");

    await Book.updateMany({ author: userId }, { author: null });

    return res.status(200).json({ message: "User deleted successfully", user: existingUser });

  } catch (error) {
    console.error(`Error while deleting user: ${error}`);
    return res.status(500).json({ message: `Internal Server Error : ${error}` });
  }
}
