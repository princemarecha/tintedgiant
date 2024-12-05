// pages/api/insertJourney.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Expense from '@/models/expense';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Establish connection
    await connectToDatabase();

    // Get the current date and calculate the first day of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Aggregate data for the current month
    const result = await Expense.aggregate([
      {
        $match: {
          // Match documents with `date` within the current month
          date: { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() },
        },
      },
      {
        $unwind: "$expenses", // Deconstruct the expenses array
      },
      {
        $group: {
          // Group by expense name and calculate total amounts in USD
          _id: "$expenses.name",
          totalAmountUSD: {
            $sum: {
              $cond: [
                { $eq: ["$expenses.currency", "USD"] },
                { $toDouble: "$expenses.amount" },
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { totalAmountUSD: -1 }, // Sort by total amount in descending order
      },
      {
        $limit: 9, // Limit the results to the top 9 expenses
      },
    ]);

    // Format the results as an object with expense names as keys
    const expenses = {};
    result.forEach((item) => {
      expenses[item._id] = `$${item.totalAmountUSD.toFixed(2)}`;
    });

    // Return the formatted response
    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return NextResponse.json(
      { message: "Error fetching monthly expenses", error: error.message },
      { status: 500 }
    );
  }
}
