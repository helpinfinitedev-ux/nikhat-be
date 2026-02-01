"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
router.post("/single", upload_1.default.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "Please upload a file",
            });
        }
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.post("/multiple", upload_1.default.array("images", 10), (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Please upload at least one file",
            });
        }
        const fileDetails = files.map((file) => ({
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
        }));
        res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            count: files.length,
            data: fileDetails,
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
