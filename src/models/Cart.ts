import mongoose, { Schema } from "mongoose";

export interface ICart {
  userId: mongoose.Types.ObjectId;
  products: IProduct[];
  totalPrice: number;
  totalQuantity: number;
}

export interface IProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, quantity: { type: Number, required: true } }],
    totalPrice: { type: Number, required: true, default: 0 },
    totalQuantity: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICart>("Cart", cartSchema);
