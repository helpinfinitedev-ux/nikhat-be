import express, { Request, Response } from "express";
import User from "../models/User";
import { authenticate, generateToken } from "../middleware/authenticate";
import bcrypt from "bcrypt";

const router = express.Router();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, mobile, password, role, emailAddress } = req.body;

    const existingUser = await User.findOne({ phoneNumber: mobile });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phoneNumber: mobile,
      emailAddress,
      password: passwordHash,
      role: role || "customer",
    });

    const token = generateToken(user._id.toString(), user.role, user.phoneNumber);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ phoneNumber: mobile });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // OTP step (admin only by default)

    const token = generateToken(user._id.toString(), user.role, user.phoneNumber);
    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Login failed" });
  }
};

// Auth routes
router.post("/login", login);
router.post("/register", register);

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user?.userId);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
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
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
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
    const user = await User.findById(req.params.id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
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
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
