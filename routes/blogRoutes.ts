import express, { Request, Response } from "express";
import Blog from "../models/Blog";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
router.post("/", async (req: Request, res: Response) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
