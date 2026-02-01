"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const authenticate_1 = require("../middleware/authenticate");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const register = async (req, res) => {
    try {
        const { name, mobile, password, role, emailAddress } = req.body;
        const existingUser = await User_1.default.findOne({ phoneNumber: mobile });
        if (existingUser) {
            return res.status(400).json({ error: "Mobile already registered" });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            phoneNumber: mobile,
            emailAddress,
            password: passwordHash,
            role: role || "customer",
        });
        const token = (0, authenticate_1.generateToken)(user._id.toString(), user.role, user.phoneNumber);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User_1.default.findOne({ phoneNumber: mobile });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid password" });
        }
        // OTP step (admin only by default)
        const token = (0, authenticate_1.generateToken)(user._id.toString(), user.role, user.phoneNumber);
        res.json({
            token,
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error, message: "Login failed" });
    }
};
exports.login = login;
// Auth routes
router.post("/login", exports.login);
router.post("/register", exports.register);
router.get("/me", authenticate_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user?.toObject(),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const user = await User_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: user,
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
        const users = await User_1.default.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
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
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user,
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
        const user = await User_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            data: user,
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
        const user = await User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
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
