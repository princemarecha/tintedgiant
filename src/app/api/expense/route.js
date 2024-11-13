// pages/api/insertExpense.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Expense from '@/models/expense';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { date, expenses, type, total_amount, attachments, expense_id } = await request.json();

    console.log('Inserting Expense:', { date, expenses, type, total_amount, attachments, expense_id });

    // Create a new Expense instance
    const newExpense = new Expense({
      date,
      expenses, // expenses should be an array of objects with type, amount, trip, truck, and driver
      type,
      total_amount,
      attachments,
      expense_id
    });

    // Save to the database
    await newExpense.save();

    return NextResponse.json({ message: 'Expense added successfully', newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ message: 'Error adding expense', error: error.message }, { status: 500 });
  }
}

// Add GET handler to retrieve all expenses
export async function GET() {
  try {
    // Establish connection
    await connectToDatabase();

    // Fetch all expenses
    const expenses = await Expense.find({});

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ message: 'Error fetching expenses', error: error.message }, { status: 500 });
  }
}
