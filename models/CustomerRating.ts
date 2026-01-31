import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerRating extends Document {
  customerName: string;
  rating: number;
  description: string;
  treatment: string;
  date: Date;
  links: string[];
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const customerRatingSchema = new Schema<ICustomerRating>(
  {
    customerName: {
      type: String,
      required: [true, "Please add customer name"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    treatment: {
      type: String,
      required: [true, "Please add a treatment"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    links: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICustomerRating>("CustomerRating", customerRatingSchema);
