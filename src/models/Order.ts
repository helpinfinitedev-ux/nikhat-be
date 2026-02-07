import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  status: string;
  paymentStatus: string;
  address: Object;
  phoneNumber: number;
  amount: number;
  products: Object[];
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
    address: {
      type: Object,
      required: [true, "Please add address"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please add phone number"],
    },
    paymentStatus: {
      type: String,
      required: [true, "Please add payment status"],
    },
    products: {
      type: [Object],
      required: [true, "Please add products"],
    },
    amount: {
      type: Number,
      required: [true, "Please add amount"],
    },
    paymentDate: {
      type: Date,
      required: [false, "Please add payment date"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>("Order", orderSchema);
