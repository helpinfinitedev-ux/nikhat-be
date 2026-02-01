// src/config/db.js
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

// Load .env from backend root: backend/.env  (db.js is at backend/src/config/db.js)
loadEnv();

const URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

console.log(URI);

export async function connectDB() {
  if (!URI) {
    console.error("MONGO_URI missing in .env (checked MONGO_URI, MONGODB_URI, DATABASE_URL)");
    process.exit(1);
  }

  // Prevent duplicate connects: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const state = mongoose.connection.readyState;
  if (state === 1 || state === 2) return;

  try {
    await mongoose.connect(URI, { serverSelectionTimeoutMS: 8000 });
    console.log(" Mongo connected:", mongoose.connection.name || mongoose.connection.db?.databaseName);
  } catch (err: any) {
    console.error(" Mongo connect error:", err?.message || err);
    process.exit(1);
  }
}

export default connectDB;
