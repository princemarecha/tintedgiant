import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch only journeys for this driver that have expenses and status is 'Arrived'
    const journeys = await Journey.find({
     // "expenses.totals": { $exists: true, $ne: [] },
      "driver.id": userId,
      status: "Arrived",
    });

    const totalExpensesByCurrency = {};
    const avgOperationalCostsByCurrency = {};

    let totalJourneys = 0;
    let totalKmTravelled = 0;

    journeys.forEach((journey) => {
      totalJourneys += 1;
      totalKmTravelled += journey.distance || 0;

      if (journey.expenses && Array.isArray(journey.expenses.totals)) {
        journey.expenses.totals.forEach(({ currency, amount }) => {
          if (!currency || isNaN(amount)) return;

          const numericAmount = parseFloat(amount);

          totalExpensesByCurrency[currency] =
            (totalExpensesByCurrency[currency] || 0) + numericAmount;

          if (!avgOperationalCostsByCurrency[currency]) {
            avgOperationalCostsByCurrency[currency] = { total: 0, count: 0 };
          }
          avgOperationalCostsByCurrency[currency].total += numericAmount;
          avgOperationalCostsByCurrency[currency].count += 1;
        });
      }
    });

    const averageOperationalCosts = Object.entries(avgOperationalCostsByCurrency).map(
      ([currency, data]) => ({
        currency,
        avg_operational_costs: data.count > 0 ? data.total / data.count : 0,
      })
    );

    const totalExpenses = Object.entries(totalExpensesByCurrency).map(
      ([currency, total]) => ({
        currency,
        operation_costs: total,
      })
    );

    const avgKmTravelled = totalJourneys > 0 ? totalKmTravelled / totalJourneys : 0;

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
