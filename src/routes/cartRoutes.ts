import express, { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { authenticate } from "../middleware/authenticate";
const router = express.Router();

router.use(authenticate);

router.post("/add-to-cart", async (req: Request, res: Response) => {
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
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      cart.totalPrice += product.price * quantity;
      cart.totalQuantity += quantity;
      await cart.save();
      return res.status(201).json({
        success: true,
      });
    } else {
      const newCart = await Cart.create({ userId, products: [{ productId, quantity }] });
      res.status(201).json({
        success: true,
      });
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    const products = await Product.find({
      _id: { $in: cart.products.map((p) => p.productId) },
    });

    console.log("CART--->", cart);

    const cartProducts = cart.products.map((product) => {
      const productData = products.find((p) => p._id.toString() === product.productId.toString());

      return {
        quantity: product.quantity,
        productId: product.productId,
        ...productData?.toObject(),
        id: cart._id.toString(),
      };
    });

    return res.status(200).json({
      success: true,
      data: cartProducts,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.patch("/remove/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const userId = (req as any)?.user?.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log(userId, "CART NOT FOUND");
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    console.log();
    console.log(cart);
    const cartProducts = cart.products.filter((product) => product.productId.toString() !== productId);
    await Cart.findByIdAndUpdate(id, {
      products: cartProducts,
    });
    res.status(200).json({ success: true, cartProducts });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any)?.user?.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }
    await Cart.findByIdAndDelete(cart._id);
    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
