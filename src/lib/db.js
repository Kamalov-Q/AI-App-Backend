import mongoose from "mongoose";
import "dotenv/config";
import User from "../models/User.js";
import { hashPassword } from "../utils/bcrypt.hash.js";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    const existingAdmin = await User.findOne({ email: "kamalov@gmail.com" });

    if (existingAdmin) {
      return;
    }

    const hashedPassword = await hashPassword("password");

    const admin = new User({
      username: "Admin",
      email: "kamalov@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    await admin.save();

    console.log(`Admin user created`);

  } catch (error) {
    console.log(`Error while connecting to DB: ${error}`);
    console.log(`Admin user not created`);
    process.exit(1); //exit with failure
  }
};
