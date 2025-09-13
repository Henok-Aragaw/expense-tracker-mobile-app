import cron from "node-cron";
import RecurringExpense from "../models/RecurringExpense";
import Expense from "../models/expense";
import User from "../models/User";
import mongoose from "mongoose";
import parser from "cron-parser";

// Run every minute to check recurring expenses
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking recurring expenses...");

  const recs = await RecurringExpense.find();

  for (const rec of recs) {
    try {
      // Parse the cron expression
      const interval = parser.parse(rec.cronExpression);
      const nextRun = interval.next().toDate();

      const now = new Date();
      const diff = Math.abs(now.getTime() - nextRun.getTime());

      if (diff < 60000) { // within 1 minute
        // Deduct from budget atomically
        const user = await User.findOneAndUpdate(
          { _id: rec.user, budget: { $gte: rec.amount } },
          { $inc: { budget: -rec.amount } },
          { new: true }
        );

        if (!user) {
          console.log(`⚠️ Not enough budget for recurring expense for user ${rec.user}`);
          continue; // skip if budget insufficient
        }

        // Create the expense
        const expense = await Expense.create({
          user: rec.user,
          amount: rec.amount,
          category: rec.category,
          note: rec.note,
          date: new Date(),
          currency: rec.currency ?? user.settings?.currency ?? "USD",
        });

        console.log(`✅ Auto expense created for user ${rec.user} (${rec.category} - ${rec.amount}). Remaining budget: ${user.budget}`);
      }
    } catch (err) {
      console.error("Error processing recurring expense:", err);
    }
  }
});
