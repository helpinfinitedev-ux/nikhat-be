import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  offer: number;
  boughtQuantity: number;
  imageUrls: string[];
  discountedPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    offer: {
      type: Number,
      default: 0,
      min: [0, "Offer cannot be negative"],
      max: [100, "Offer cannot exceed 100%"],
    },
    boughtQuantity: {
      type: Number,
      default: 0,
      min: [0, "Quantity cannot be negative"],
    },
    imageUrls: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("discountedPrice").get(function (this: IProduct) {
  return this.price - (this.price * this.offer) / 100;
});

export default mongoose.model<IProduct>("Product", productSchema);
