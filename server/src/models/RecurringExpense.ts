import mongoose, { Document, Schema } from 'mongoose';

export interface IRecurringExpense extends Document {
 user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  cronExpression: string;
  note?: string;
  currency: string;
}

const recSchema = new Schema<IRecurringExpense>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  cronExpression: { type: String, required: true },
  note: String,
  currency: { type: String, default: 'USD' },
});

export default mongoose.model<IRecurringExpense>('RecurringExpense', recSchema);