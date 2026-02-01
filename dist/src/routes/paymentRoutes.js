"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Payment_1 = __importDefault(require("../models/Payment"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const payment = await Payment_1.default.create(req.body);
        const populatedPayment = await Payment_1.default.findById(payment._id).populate("userId", "name emailAddress").populate("productId", "name price");
        res.status(201).json({
            success: true,
            data: populatedPayment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const payments = await Payment_1.default.find().populate("userId", "name emailAddress").populate("productId", "name price").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const payment = await Payment_1.default.findById(req.params.id).populate("userId", "name emailAddress phoneNumber").populate("productId", "name price description");
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: "Payment not found",
            });
        }
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
        const payments = await Payment_1.default.find({ userId: req.params.userId }).populate("productId", "name price").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const payment = await Payment_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("userId", "name emailAddress")
            .populate("productId", "name price");
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: "Payment not found",
            });
        }
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const payment = await Payment_1.default.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: "Payment not found",
            });
        }
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
exports.default = router;
