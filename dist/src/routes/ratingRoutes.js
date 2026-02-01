"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CustomerRating_1 = __importDefault(require("../models/CustomerRating"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const rating = await CustomerRating_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: rating,
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
        const ratings = await CustomerRating_1.default.find().sort({ date: -1 });
        res.status(200).json({
            success: true,
            count: ratings.length,
            data: ratings,
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
        const rating = await CustomerRating_1.default.findById(req.params.id);
        if (!rating) {
            return res.status(404).json({
                success: false,
                error: "Rating not found",
            });
        }
        res.status(200).json({
            success: true,
            data: rating,
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
        const rating = await CustomerRating_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!rating) {
            return res.status(404).json({
                success: false,
                error: "Rating not found",
            });
        }
        res.status(200).json({
            success: true,
            data: rating,
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
        const rating = await CustomerRating_1.default.findByIdAndDelete(req.params.id);
        if (!rating) {
            return res.status(404).json({
                success: false,
                error: "Rating not found",
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
