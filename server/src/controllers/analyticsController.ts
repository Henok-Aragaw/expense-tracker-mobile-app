import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Expense from '../models/expense';

export const getAnalytics = async(req:AuthRequest, res: Response, next:NextFunction):Promise<void> => {
    try {
       const pipeline = [
        {$match: {user: req.user!.id}},
        {$group: {_id: '$category', total: {$sum: '$amount'}}}
       ]
       const results = await Expense.aggregate(pipeline)
       res.json({results})

    } catch (error) {
        next(error)
    }
}