import { Response, NextFunction } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const setBudget = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { budget } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { budget },
      { new: true }
    );

    res.json({
      message: "Budget create successfully",
      budget: user?.budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudget = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("budget name email");

    res.json({
      budget: user?.budget ?? 0,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { budget } = req.body;

    if (typeof budget !== "number" || budget < 0) {
      res.status(400).json({ message: "Budget must be a positive number" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { budget },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "✅ Budget updated successfully",
      budget: user.budget,
    });
  } catch (err) {
    next(err);
  }
};