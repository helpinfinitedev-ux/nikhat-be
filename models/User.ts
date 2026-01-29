import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  emailAddress?: string;
  phoneNumber: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastPurchase: Date | null;
  purchaseQuantity: number;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    emailAddress: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please add a phone number"],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    lastPurchase: {
      type: Date,
      default: null,
    },
    purchaseQuantity: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
