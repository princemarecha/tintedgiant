import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Establish connection
    await connectToDatabase();

    // Get the current date and calculate the start of the 12-month range
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Perform aggregation to group journeys by month for the past 12 months
    const result = await Journey.aggregate([
      {
        $match: {
          // Match journeys with a departure date in the last 12 months
          departure: { $gte: startDate.toISOString(), $lte: now.toISOString() },
        },
      },
      {
        $group: {
          // Group by year and month of the departure date
          _id: {
            month: { $month: { $dateFromString: { dateString: "$departure" } } },
          },
          count: { $sum: 1 }, // Count the number of journeys in each group
        },
      },
    ]);

    // Format the result into a map of counts for the last 12 months
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // Initialize counts for all 12 months
    const journeys = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = months[date.getMonth()];
      journeys[month] = 0; // Default count is 0
    }

    // Populate the counts from the aggregation result
    result.forEach((item) => {
      const month = months[item._id.month - 1]; // Convert month index to name
      journeys[month] = item.count;
    });

    // Reverse the journey order
    const reversedJourneys = Object.entries(journeys)
      .reverse()
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Return the reversed result
    return NextResponse.json({ journeys: reversedJourneys });
  } catch (error) {
    console.error("Error fetching journeys per month:", error);
    return NextResponse.json(
      { message: "Error fetching journeys per month", error: error.message },
      { status: 500 }
    );
  }
}
