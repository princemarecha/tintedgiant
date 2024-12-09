import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Ensure Journey model is correctly defined
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log("Connecting to database...");
    // Establish connection
    await connectToDatabase();
    console.log("Database connection established.");

    // Get the current date and calculate the start of the 12-month range
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    console.log("Date Range:", { startDate, now });

    // Perform aggregation to group journeys by month for the past 12 months
    console.log("Starting aggregation pipeline...");
    const result = await Journey.aggregate([
      {
        $match: {
          // Match journeys with a createdAt date in the last 12 months
          createdAt: {
            $gte: startDate, // Start date as a Date object
            $lte: now,       // End date as a Date object
          },
        },
      },
      {
        $group: {
          // Group by the month and year of the createdAt field
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 }, // Count journeys
        },
      },
      {
        $sort: {
          "_id.year": 1, // Sort by year
          "_id.month": 1, // Then by month
        },
      },
    ]);

    console.log("Aggregation Result:", JSON.stringify(result, null, 2));

    // Initialize counts for all 12 months
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    console.log("Initializing journey counts for 12 months...");
    const journeys = months.reduce((acc, month) => {
      acc[month] = 0; // Default count is 0
      return acc;
    }, {});
    console.log("Initialized Journey Counts:", journeys);

    // Populate the counts from the aggregation result
    console.log("Populating journey counts from aggregation result...");
    result.forEach((item) => {
      const monthName = months[item._id.month - 1]; // Convert month index to name
      journeys[monthName] = item.count;
      console.log(`Processed Month: ${monthName}, Count: ${item.count}`);
    });

    // Log the final journeys object before returning
    console.log("Final Journey Counts:", journeys);

    // Return the journeys object
    return NextResponse.json({ journeys });
  } catch (error) {
    console.error("Error fetching journeys per month:", error);
    return NextResponse.json(
      { message: "Error fetching journeys per month", error: error.message },
      { status: 500 }
    );
  }
}
