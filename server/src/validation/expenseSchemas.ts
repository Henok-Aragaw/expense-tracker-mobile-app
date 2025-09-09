import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.enum(['food', 'transport', 'bills', 'shopping', 'other']),
  note: z.string().optional(),
  date: z.union([z.string().datetime(), z.date()]).optional(),
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