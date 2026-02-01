import express, { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { authenticate } from "../middleware/authenticate";
const router = express.Router();

router.post("/add-to-cart", authenticate, async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const cart = await Cart.findOne({ userId });
    console.log(cart);
    if (cart) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }
      cart.products.push({ productId, quantity });
      cart.totalPrice += product.price * quantity;
      cart.totalQuantity += quantity;
      await cart.save();
      res.status(201).json({
        success: true,
        data: cart.toObject(),
      });
    } else {
      const newCart = await Cart.create({ userId, products: [{ productId, quantity }] });
      res.status(201).json({
        success: true,
        data: newCart.toObject(),
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    console.log(cart);
    const products = await Product.find({ _id: { $in: cart?.products.map((product) => product.productId) } });
    const cartProducts = cart?.products.map((product) => {
      const productData = products.find((p) => p._id.toString() === product.productId.toString());
      return {
        quantity: product.quantity,
        ...productData?.toObject(),
      };
    });
    res.status(200).json({
      success: true,
      data: cartProducts,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/remove-from-cart", async (req: Request, res: Response) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = cart.products.filter((product) => product.productId.toString() !== productId);
      //   cart.totalPrice -= cart.products.find((p) => p.productId.toString() === productId)?.price * cart.products.find((p) => p.productId.toString() === productId)?.quantity;
      cart.totalQuantity -= cart.products.find((p) => p.productId.toString() === productId)?.quantity || 0;
      await cart.save();
    }
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
