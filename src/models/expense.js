// models/Expense.js
import {Schema, models, model} from 'mongoose';

const expenses = new Schema({
    type: {type:String, required:true},
    amount: {type:String, required:false},
    trip: { type: String, required: false },
    truck: { type: String, required: false },
    driver: { type: String, required: false },
})

const ExpenseSchema = new Schema({
    date: { type: String, required: true },
    expenses: [expenses],
    type: { type: String, required: true },
    total_amount: { type: String, required: true },
    attachments: { type: String, required: true },
    expense_id: { type: String, required: true }
}, { timestamps: true });


const Expense = models.Expense || model('Expense', ExpenseSchema);
export default Expense

