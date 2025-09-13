import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from "../models/expense";
import RecurringExpense from "../models/RecurringExpense";
import User from "../models/User";
import mongoose from "mongoose";
import parser from "cron-parser";

export const getAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1️⃣ Aggregate total expenses per category
    const pipeline = [
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ];

    const categoryTotals = await Expense.aggregate(pipeline);

    // 2️⃣ Calculate total expenses
    let totalExpenses = categoryTotals.reduce((acc, curr) => acc + curr.total, 0);

    // 3️⃣ Calculate percentage per category
    const categoryPercentages = categoryTotals.map(cat => ({
      category: cat._id,
      total: cat.total,
      percentage: totalExpenses > 0 ? ((cat.total / totalExpenses) * 100).toFixed(2) : "0.00"
    }));

    // 4️⃣ Get user's remaining budget
    const user = await User.findById(userId);

    // 5️⃣ Get recurring expenses
    const recurringExpenses = await RecurringExpense.find({ user: userId });

    // 6️⃣ Predict upcoming expenses for next 7 days
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const upcomingRecurringExpenses: any[] = [];

    recurringExpenses.forEach(rec => {
      try {
        const interval = parser.parse(rec.cronExpression, { currentDate: now, endDate: sevenDaysLater });
        const dates: Date[] = [];
        while (true) {
          try {
            const nextRun = interval.next().toDate();
            dates.push(nextRun);
          } catch (e) {
            break;
          }
        }

        const totalRecurringAmount = dates.length * rec.amount;

        upcomingRecurringExpenses.push({
          ...rec.toObject(),
          upcomingDates: dates,
          totalUpcomingAmount: totalRecurringAmount
        });

        // Add upcoming recurring amount to total expenses
        totalExpenses += totalRecurringAmount;

      } catch (err) {
        upcomingRecurringExpenses.push({
          ...rec.toObject(),
          upcomingDates: [],
          totalUpcomingAmount: 0,
          error: "Invalid cron expression"
        });
      }
    });

    res.json({
      totalExpenses,
      remainingBudget: user?.budget ?? 0,
      categories: categoryPercentages,
      recurringExpenses: upcomingRecurringExpenses
    });

  } catch (error) {
    next(error);
  }
};
