import express, { Request, Response } from "express";
import Order from "../models/Order";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
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
    const order = await Order.create(req.body);
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
