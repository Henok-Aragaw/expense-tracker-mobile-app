
import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from "../models/expense";
import User from "../models/User";
import RecurringExpense from "../models/RecurringExpense";
import {createExpenseSchema, updateExpenseSchema, createRecurringSchema } from "../validation/expenseSchemas";


export const createExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // 1️⃣ Validate request body
    const parsed = createExpenseSchema.parse(req.body);

    const { amount, category, note, date, currency } = parsed;

    // 2️⃣ Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 3️⃣ Check if budget is enough
    if (user.budget < amount) {
      res.status(400).json({
        message: `Not enough budget. Current budget: ${user.budget}`,
      });
      return;
    }

    // 4️⃣ Create the expense
    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      note,
      date,
      currency,
    });

    // 5️⃣ Deduct budget **after successful creation**
    user.budget -= amount;
    await user.save();

    // 6️⃣ Return response with remaining budget
    res.status(201).json({
      message: "✅ Expense created & budget updated",
      expense,
      remainingBudget: user.budget,
    });
  } catch (err) {
    next(err);
  }
};

//update expenses
export const updateExpense = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const parsed = createExpenseSchema.parse(req.body);

    const expense = await Expense.findById(id);
    if (!expense || expense.user.toString() !== req.user.id) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    const budgetChange = parsed.amount - expense.amount;

    // Check if user has enough budget for increase
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, budget: { $gte: budgetChange } },
      { $inc: { budget: -budgetChange } },
      { new: true }
    );

    if (!user) {
      res.status(400).json({ message: "Insufficient budget for update" });
      return;
    }

    Object.assign(expense, parsed);
    await expense.save();

    res.json({
      message: "✅ Expense updated & budget adjusted",
      expense,
      remainingBudget: user.budget,
    });
  } catch (err) {
    next(err);
  }
};


//delete expenses
export const deleteExpenses = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense || expense.user.toString() !== req.user.id) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    // Refund the budget
    const user = await User.findById(req.user.id);
    if (user) {
      user.budget += expense.amount;
      await user.save();
    }

    await expense.deleteOne();

    res.json({
      message: "✅ Expense deleted & budget refunded",
      refundedAmount: expense.amount,
      remainingBudget: user?.budget,
    });
  } catch (err) {
    next(err);
  }
};


//get expenses
export const getExpense = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user!.id });
    if(!expense) {
     res.status(404).json({ message: 'Not found' });
     return; 
    }

    res.json({ expense });
  } catch (err) {
    next(err);
  }
};

//get all expense
export const listExpense= async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const expenses = await Expense.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

export const createRecurring = async(req:AuthRequest, res:Response, next:NextFunction): Promise<void> => {
  try {
    const parsed = createRecurringSchema.parse(req.body);
    const rec = await RecurringExpense.create({user:req.user!.id, ...parsed});
    res.status(201).json({rec})
  } catch (error) {
    next(error)
  }
}

export const listRecurring = async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
  try {
    const rec = await RecurringExpense.find({ user: req.user!.id });
    res.json({ rec });
  } catch (err) {
    next(err);
  }
};

export const updateRecurring = async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { id } = req.params;
    const rec = await RecurringExpense.findOneAndUpdate({ _id: id, user: req.user!.id }, req.body, { new: true });
    res.json({ rec });
  } catch (err) {
    next(err);
  }
};

export const deleteRecurring = async (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
  try {
    const { id } = req.params;
    await RecurringExpense.findOneAndDelete({ _id: id, user: req.user!.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};