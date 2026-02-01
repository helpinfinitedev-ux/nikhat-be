"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdminUser = async () => {
    const adminUser = await User_1.default.findOne({ role: "admin" });
    if (!adminUser) {
        const passwordHash = await bcrypt_1.default.hash("admin123", 10);
        await User_1.default.create({ name: "Admin", emailAddress: "admin@example.com", phoneNumber: "1234567890", password: passwordHash, role: "admin" });
    }
    console.log("Admin user created");
};
exports.createAdminUser = createAdminUser;
