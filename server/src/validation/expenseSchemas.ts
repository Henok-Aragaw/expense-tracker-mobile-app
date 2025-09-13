import { z } from "zod";

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.string(),
  note: z.string().optional(),
  date: z.preprocess((arg) => {
    if (!arg || typeof arg === "object") return new Date();
    const d = new Date(arg as string | number | Date);
    return isNaN(d.getTime()) ? new Date() : d;
  }, z.date()),
  currency: z.string().optional(),
});



export const updateExpenseSchema = createExpenseSchema.partial();

export const createRecurringSchema = z.object({
  amount: z.number().positive(),
  category: z.string(),  
  cronExpression: z.string().min(3),
  note: z.string().optional(),
  currency: z.string().optional(),
});