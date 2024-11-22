import connectToDatabase from '@/utils/mongo/mongoose';
import ExpenseFramework from '@/models/expense_framework';
import { NextResponse } from 'next/server';

// POST handler: Add or update the ExpenseFramework
export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { regular, other } = await request.json();

    console.log('Inserting/Updating Expense Framework:', { regular, other });

    // Check for an existing document and update it if found, otherwise create a new one
    const existingFramework = await ExpenseFramework.findOne({});
    let expenseFramework;

    if (existingFramework) {
      // Update the existing document
      existingFramework.regular = regular || existingFramework.regular;
      existingFramework.other = other || existingFramework.other;
      await existingFramework.save();
      expenseFramework = existingFramework;
    } else {
      // Create a new document if none exists
      expenseFramework = new ExpenseFramework({
        regular,
        other,
      });
      await expenseFramework.save();
    }

    return NextResponse.json({
      message: 'Expense Framework added/updated successfully',
      expenseFramework,
    });
  } catch (error) {
    console.error('Error adding/updating Expense Framework:', error);
    return NextResponse.json(
      { message: 'Error adding/updating Expense Framework', error: error.message },
      { status: 500 }
    );
  }
}

// GET handler: Retrieve all ExpenseFramework documents
export async function GET() {
  try {
    // Establish connection
    await connectToDatabase();

    // Fetch all ExpenseFramework documents
    const frameworks = await ExpenseFramework.find({});

    return NextResponse.json({ frameworks });
  } catch (error) {
    console.error('Error fetching Expense Frameworks:', error);
    return NextResponse.json(
      { message: 'Error fetching Expense Frameworks', error: error.message },
      { status: 500 }
    );
  }
}
