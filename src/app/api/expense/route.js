import connectToDatabase from '@/utils/mongo/mongoose';
import Expense from '@/models/expense';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { date, expenses, type, total_amount, attachments, trip } = await request.json();

    console.log('Inserting Expense:', { date, expenses, type, total_amount, attachments, trip });

    // Validate total_amount structure as an array of objects
    if (!Array.isArray(total_amount) || total_amount.some(item => !item.currency || !item.amount)) {
      return NextResponse.json({ 
        message: 'Invalid total_amount format. It must be an array with each item containing currency and amount.' 
      }, { status: 400 });
    }

    // Create a new Expense instance
    const newExpense = new Expense({
      date,
      expenses, // Should be an array of objects with name and amount fields
      type,
      total_amount, // Now properly validated as an array
      attachments,
      trip, // Mongoose will use the default value if trip is not provided
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
export async function GET(request) {
  try {
    // Parse query parameters for pagination, search, and type
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;  // Default to page 1
    const limit = parseInt(searchParams.get('limit')) || 9;  // Default limit to 9 items per page
    const search = searchParams.get('search') || '';  // Search query (empty by default)
    const type = searchParams.get('type') || '';  // Type filter (empty by default)

    // Log query parameters to check values
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('Search:', search);
    console.log('Type:', type);

    // Set pagination skip value
    const skip = (page - 1) * limit;

    // Initialize the filter object
    let filter = {};

    // Apply search filter for trip.route if a search term is provided
    if (search) {
      filter['trip.route'] = {
        $regex: search,  // Match the search term anywhere in the route field
        $options: 'i',   // Case-insensitive search
      };
    }

    // Apply type filter if a type is provided
    if (type) {
      filter.type = { 
        $regex: type, 
        $options: 'i'  // Case-insensitive match
      };
    }

    // Log the constructed filter
    console.log('Constructed Filter:', filter);

    // Fetch filtered, paginated expenses from the database
    const expenses = await Expense.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort by most recent

    // Count the total items matching the filter
    const totalItems = await Expense.countDocuments(filter);

    // Calculate total pages based on the total items
    const totalPages = Math.ceil(totalItems / limit);

    // Return the response
    return NextResponse.json({
      expenses,
      page: parseInt(page),
      limit,
      totalItems,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { message: 'Error fetching expenses', error: error.message },
      { status: 500 }
    );
  }
}
