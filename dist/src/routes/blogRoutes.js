"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Blog_1 = __importDefault(require("../models/Blog"));
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog_1.default.find();
        res.status(200).json({
            success: true,
            data: blogs,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog_1.default.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const blog = await Blog_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});
router.patch("/:id", async (req, res) => {
    try {
        const blog = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            data: blog,
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
        const blog = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                error: "Blog not found",
            });
        }
        res.status(200).json({
            success: true,
            data: {},
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
