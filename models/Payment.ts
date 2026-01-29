import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  price: number;
  mode: "card" | "upi" | "netbanking" | "wallet" | "cod";
  razorpayId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add user ID"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please add product ID"],
    },
    price: {
      type: Number,
      required: [true, "Please add price"],
      min: [0, "Price cannot be negative"],
    },
    mode: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cod"],
      required: [true, "Please add payment mode"],
    },
    razorpayId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
