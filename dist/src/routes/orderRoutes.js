"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.use(authenticate_1.authenticate);
router.get("/", async (req, res) => {
    try {
        const orders = await Order_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const order = await Order_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const payload = req.body;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, payload, { new: true });
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
