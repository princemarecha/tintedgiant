// models/Expense.js
import { Schema, models, model } from 'mongoose';

const expenses = new Schema({
  name: { type: String, required: true }, // Change 'name' to 'expense' to match the input
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  file: { type: String, required: false, default: null }, // Allow null for file
});


const total = new Schema({
  currency: { type: String, required: true },
  amount: { type: String, required: false },
});

const trip = new Schema({
  route: { type: String, required: false, default: 'N/A' }, // Default value for currency
  id: { type: String, required: false, default: '0' },     // Default value for amount
});

const attachment = new Schema({
  publicId: { type: String, required: false},
  url: { type: String, required: false },     
});

const ExpenseSchema = new Schema({
  date: { type: String, required: true },
  expenses: [expenses],
  trip: { type: trip, default: {route: "N/A", id: "N/A" } }, // Set default value as empty object for trip
  type: { type: String, required: true },
  total_amount: [total],
  attachments: [attachment],
}, { timestamps: true });

const Expense = models.Expense || model('Expense', ExpenseSchema);
export default Expense;
