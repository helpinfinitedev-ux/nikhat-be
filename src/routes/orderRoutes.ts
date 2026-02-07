import express, { Request, Response } from "express";
import Order from "../models/Order";
import { authenticate } from "../middleware/authenticate";
import User from "../models/User";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const orders = await Order.find().sort({ createdAt: -1 });
    const users = await User.find({ _id: { $in: orders.map((order) => order.userId) } });
    const userMap = new Map(users.map((user) => [user._id.toString(), user.toObject()]));
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map((order) => {
        return {
          ...order.toObject(),
          user: userMap.get(order.userId.toString()),
        };
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map((order) => {
        return {
          ...order.toObject(),
          user: user?.toObject(),
        };
      }),
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    payload.userId = (req as any).user?.userId;
    payload.status = "pending";
    payload.paymentStatus = "pending";

    const order = await Order.create(payload);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, payload, { new: true });
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
