import mongoose from "mongoose";
import "dotenv/config";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting to DB: ${error}`);
    process.exit(1); //exit with failure
  }
};
