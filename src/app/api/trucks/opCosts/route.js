import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract plate ID from query parameters
    const { searchParams } = new URL(request.url);
    const plateId = searchParams.get('plateId');

    if (!plateId) {
      return NextResponse.json(
        { message: "Plate ID is required" },
        { status: 400 }
      );
    }

    console.log("Received plateId:", plateId);

    // Fetch journeys where expenses.totals exists and truck.plate_id matches
    const journeys = await Journey.find({
      "expenses.totals": { $exists: true, $ne: [] },
      "truck.plate_id": plateId, // Match by truck plate_id
    });

    console.log("Fetched journeys:", journeys);

    // Initialize storage for totals and averages
    const totalExpensesByCurrency = {};
    const avgOperationalCostsByCurrency = {};

    let totalJourneys = 0;
    let totalKmTravelled = 0;

    // Process the fetched journeys
    journeys.forEach((journey) => {
      totalJourneys += 1; // Increment the journey count
      totalKmTravelled += journey.distance || 0; // Add journey distance safely

      // Safely access the expenses.totals array
      if (journey.expenses && Array.isArray(journey.expenses.totals)) {
        journey.expenses.totals.forEach(({ currency, amount }) => {
          if (!currency || isNaN(amount)) return; // Skip invalid entries

          const numericAmount = parseFloat(amount); // Ensure amount is a number

          // Total expenses per currency
          totalExpensesByCurrency[currency] =
            (totalExpensesByCurrency[currency] || 0) + numericAmount;

          // Average operational costs per currency
          if (!avgOperationalCostsByCurrency[currency]) {
            avgOperationalCostsByCurrency[currency] = { total: 0, count: 0 };
          }
          avgOperationalCostsByCurrency[currency].total += numericAmount;
          avgOperationalCostsByCurrency[currency].count += 1;
        });
      }
    });

    // Calculate average costs
    const averageOperationalCosts = Object.entries(avgOperationalCostsByCurrency).map(
      ([currency, data]) => ({
        currency,
        avg_operational_costs: data.count > 0 ? data.total / data.count : 0,
      })
    );

    // Prepare total expenses
    const totalExpenses = Object.entries(totalExpensesByCurrency).map(
      ([currency, total]) => ({
        currency,
        operation_costs: total,
      })
    );

    // Calculate average kilometers traveled
    const avgKmTravelled = totalJourneys > 0 ? totalKmTravelled / totalJourneys : 0;

    // Return the response
    return NextResponse.json({
      totalExpenses,
      averageOperationalCosts,
      totalJourneys,
      totalKmTravelled,
      avgKmTravelled,
    });
  } catch (error) {
    console.error("Error analyzing expenses:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
