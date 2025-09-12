import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  note?: string;
  date: Date;
  currency: string;
}

const expenseSchema = new Schema<IExpense>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  note: {type: String},
  date: { type: Date, default: Date.now },
  currency: { type: String, default: 'USD' },
});

export default mongoose.model<IExpense>('Expense', expenseSchema);