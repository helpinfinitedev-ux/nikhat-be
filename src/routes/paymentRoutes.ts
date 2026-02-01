import express, { Request, Response } from "express";
import Payment from "../models/Payment";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const payment = await Payment.create(req.body);
    const populatedPayment = await Payment.findById(payment._id).populate("userId", "name emailAddress").populate("productId", "name price");

    res.status(201).json({
      success: true,
      data: populatedPayment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find().populate("userId", "name emailAddress").populate("productId", "name price").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("userId", "name emailAddress phoneNumber").populate("productId", "name price description");

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).populate("productId", "name price").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
