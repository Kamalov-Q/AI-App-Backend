import User from "../models/User.js";
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

const comparePassword = async (password, hashedPassword) => {
  try {
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatch;
  } catch (error) {
    console.error(`Error while comparing password: ${error}`);
  }
};

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b123a4f9d2e4b8a3e7c123"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     profileImg:
 *                       type: string
 *                       example: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=john_doe"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       409:
 *         description: Email or Username already exists
 *       422:
 *         description: Validation error (missing or invalid fields)
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "mypassword123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64b123a4f9d2e4b8a3e7c123"
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     profileImg:
 *                       type: string
 *                       example: "https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=john_doe"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error (missing fields)
 *       500:
 *         description: Internal server error
 */
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

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user?._id);

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        profileImg: user?.profileImg,
      },
      token,
    });
  } catch (error) {
    console.error(`Error while logging in: ${error}`);
    return res.status(500).json({ message: `Something went wrong : ${error}` });
  }
};
