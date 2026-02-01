// src/config/db.js
import { config as loadEnv } from "dotenv";
import mongoose from "mongoose";

loadEnv();

const URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

// Cache the connection for serverless environments
let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (!URI) {
    console.error("MONGO_URI missing in .env (checked MONGO_URI, MONGODB_URI, DATABASE_URL)");
    throw new Error("MongoDB URI not configured");
  }

  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If already connecting, wait for the existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering for serverless
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(URI, opts).then((mongoose) => {
      console.log("Mongo connected:", mongoose.connection.name);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    cached.promise = null;
    console.error("Mongo connect error:", err?.message || err);
    throw err;
  }

  return cached.conn;
}

export default connectDB;
