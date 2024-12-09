// pages/api/insertJourney.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Expense from '@/models/expense';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse query parameters to get the 'currency', default to 'USD'
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get('currency') || 'USD';

    // Get the current date and calculate the first and last day of the month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Step 1: Aggregate top 9 expenses for the specified currency
    const expensesResult = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() },
        },
      },
      {
        $unwind: "$expenses", // Deconstruct the expenses array
      },
      {
        $match: {
          "expenses.currency": currency, // Filter by the specified currency
        },
      },
      {
        $group: {
          _id: "$expenses.name", // Group by expense name
          totalAmount: {
            $sum: { $toDouble: "$expenses.amount" }, // Sum the amounts
          },
        },
      },
      {
        $sort: { totalAmount: -1 }, // Sort by total amount descending
      },
      {
        $limit: 9, // Limit to top 9 results
      },
    ]);

    // Format the result as an object with expense names as keys
    const expenses = {};
    expensesResult.forEach((item) => {
      expenses[item._id] = `$${item.totalAmount.toFixed(2)}`;
    });

    // Step 2: Calculate the total for the specified currency
    const totalResult = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() },
        },
      },
      {
        $unwind: "$expenses", // Deconstruct the expenses array
      },
      {
        $match: {
          "expenses.currency": currency, // Filter by the specified currency
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$expenses.amount" } }, // Sum the amounts
        },
      },
    ]);

    const currencyTotal =
      totalResult.length > 0
        ? `${totalResult[0].totalAmount.toFixed(2)}`
        : `0.00`;

    // Step 3: Get all unique currencies
    const currenciesResult = await Expense.aggregate([
      {
        $unwind: "$expenses", // Deconstruct the expenses array
      },
      {
        $group: {
          _id: null,
          currencies: { $addToSet: "$expenses.currency" }, // Collect unique currencies
        },
      },
    ]);

    const availableCurrencies =
      currenciesResult.length > 0 ? currenciesResult[0].currencies : [];

    // Return the response
    return NextResponse.json({
      currency: currency,
      expenses,
      total: currencyTotal,
      availableCurrencies,
    });
  } catch (error) {
    console.error("Error fetching monthly expenses:", error);
    return NextResponse.json(
      { message: "Error fetching monthly expenses", error: error.message },
      { status: 500 }
    );
  }
}
