import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/database";

dotenv.config();

// Connect to MongoDB before handling requests
let isConnected = false;

const handler = async (req: any, res: any) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};

// Export for Vercel serverless
export default handler;
