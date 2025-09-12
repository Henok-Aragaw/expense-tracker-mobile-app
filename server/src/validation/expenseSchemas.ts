import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number(),
  category: z.string(),
  note: z.string().optional(),
  date: z.preprocess((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') return new Date(arg);
    return arg;
  }, z.date().optional()),
  currency: z.string().optional(),
});


export const updateExpenseSchema = createExpenseSchema.partial();

export const createRecurringSchema = z.object({
  amount: z.number().positive(),
  category: z.enum(['food', 'transport', 'bills', 'shopping', 'other']),
  cronExpression: z.string().min(3),
  note: z.string().optional(),
  currency: z.string().optional(),
});