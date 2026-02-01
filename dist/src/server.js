"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const app = (0, express_1.default)();
// createAdminUser();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads"));
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to E-Commerce API",
        version: "1.0.0",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            ratings: "/api/ratings",
            payments: "/api/payments",
            upload: "/api/upload",
        },
    });
});
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/ratings", ratingRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Server Error",
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    (0, database_1.default)().then(() => {
        console.log(`Server running on port ${PORT}`);
    });
});
exports.default = app;
