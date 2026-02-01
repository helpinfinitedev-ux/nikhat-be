"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.post("/add-to-cart", authenticate_1.authenticate, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const cart = await Cart_1.default.findOne({ userId });
        console.log(cart);
        if (cart) {
            const product = await Product_1.default.findById(productId);
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
        }
        else {
            const newCart = await Cart_1.default.create({ userId, products: [{ productId, quantity }] });
            res.status(201).json({
                success: true,
                data: newCart.toObject(),
            });
        }
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/", authenticate_1.authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const cart = await Cart_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, error: "Cart not found" });
        }
        console.log(cart);
        const products = await Product_1.default.find({ _id: { $in: cart?.products.map((product) => product.productId) } });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.delete("/remove-from-cart", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart_1.default.findOne({ userId });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
