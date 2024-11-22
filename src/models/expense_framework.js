import { Schema, models, model } from 'mongoose';

const ExpenseFrameworkSchema = new Schema(
  {
    regular: { type: [String], required: true },
    other: { type: [String], required: true },
  },
  { timestamps: true }
);

const ExpenseFramework = models.ExpenseFramework || model('ExpenseFramework', ExpenseFrameworkSchema);
export default ExpenseFramework;
