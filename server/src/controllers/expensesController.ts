import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from "../models/expense";
import RecurringExpense from "../models/RecurringExpense";
import { createExpenseSchema, updateExpenseSchema, createRecurringSchema } from "../validation/expenseSchemas";
import mongoose from "mongoose";


export const createExpense = async(
    req:AuthRequest,
    res:Response,
    next:NextFunction
): Promise<void> => {

    try {
      const parsed = createExpenseSchema.parse(req.body);
      
      if(!req.user){
        res.status(401).json({message: "Unauthorized"});
        return;
      }

      const date = 
      parsed.date instanceof Date 
      ? parsed.date
      : parsed.date
      ? new Date(parsed.date as any)
      : new Date();

      const expense = await Expense.create({
      user: new mongoose.Types.ObjectId(req.user.id), // explicit ObjectId
      ...parsed,
      date,
    });

      res.status(201).json({ expense });
    } catch (error) {
        next(error)
    }
}


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
export const listExpense = async(req:AuthRequest, res:Response, next:NextFunction): Promise<void> => {
    try {
      const expenses = await Expense.find({user:req.user!.id}).sort({date: -1})  
      res.json({expenses})
    } catch (error) {
        next(error)
    }
}