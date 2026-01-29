import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  status: string;
  paymentStatus: string;
  amount: number;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add user ID"],
    },
    status: {
      type: String,
      required: [true, "Please add status"],
    },
    paymentStatus: {
      type: String,
      required: [true, "Please add payment status"],
    },
    amount: {
      type: Number,
      required: [true, "Please add amount"],
    },
    paymentDate: {
      type: Date,
      required: [true, "Please add payment date"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", orderSchema);
