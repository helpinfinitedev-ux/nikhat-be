import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    excerpt: {
      type: String,
      required: [false, "Please add an excerpt"],
    },
    content: {
      type: String,
      required: [true, "Please add  content"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlog>("Blog", blogSchema);
