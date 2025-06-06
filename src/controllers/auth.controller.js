import { UserModel } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.error(`Error while generating token: ${error}`);
  }
};

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error(`Error while hashing password: ${error}`);
  }
};

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

    //check if email is valid
    if (!email.includes("@")) {
      return res.status(422).json({ message: "Email must be valid" });
    }

    //Check if the user exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    //Create a new user
    const profileImg = `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${username}`;

    const newUser = new UserModel({
      email,
      username,
      password,
      profileImg,
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
      },
      token,
    });
  } catch (error) {
    console.error(`Error while signing up: ${error}`);
    return res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};
