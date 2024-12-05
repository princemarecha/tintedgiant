import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Establish connection
    await connectToDatabase();

    // Get the current date and calculate the first and last day of the current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Aggregate data for the current month
    const stats = await Journey.aggregate([
      {
        $match: {
          // Match journeys within the current month
          departure: { $gte: startOfMonth.toISOString(), $lt: endOfMonth.toISOString() },
        },
      },
      {
        $facet: {
          // Top cargo
          topCargo: [
            { $group: { _id: "$cargo", trips: { $sum: 1 } } },
            { $sort: { trips: -1 } },
            { $limit: 1 },
          ],
          // Top destination
          topDestination: [
            { $group: { _id: "$to", trips: { $sum: 1 } } },
            { $sort: { trips: -1 } },
            { $limit: 1 },
          ],
          // Top driver
          topDriver: [
            {
              $group: {
                _id: "$driver",
                trips: { $sum: 1 },
                kmTravelled: { $sum: "$distance" },
              },
            },
            { $sort: { trips: -1, kmTravelled: -1 } },
            { $limit: 1 },
          ],
          // Top truck
          topTruck: [
            {
              $group: {
                _id: "$truck",
                trips: { $sum: 1 },
                kmTravelled: { $sum: "$distance" },
              },
            },
            { $sort: { trips: -1, kmTravelled: -1 } },
            { $limit: 1 },
          ],
        },
      },
    ]);

    // Extract results from the aggregation
    const topCargo = stats[0]?.topCargo[0] || { _id: "N/A", trips: 0 };
    const topDestination = stats[0]?.topDestination[0] || { _id: "N/A", trips: 0 };
    const topDriver = stats[0]?.topDriver[0] || { _id: "N/A", trips: 0, kmTravelled: 0 };
    const topTruck = stats[0]?.topTruck[0] || { _id: "N/A", trips: 0, kmTravelled: 0 };

    // Construct the response
    return NextResponse.json({
      topCargo: {
        name: topCargo._id || "N/A",
        trips: topCargo.trips || 0,
      },
      topDestination: {
        name: topDestination._id || "N/A",
        trips: topDestination.trips || 0,
      },
      topDriver: {
        name: topDriver._id || "N/A",
        trips: topDriver.trips || 0,
        kmTravelled: topDriver.kmTravelled || 0,
      },
      topTruck: {
        name: topTruck._id || "N/A",
        trips: topTruck.trips || 0,
        kmTravelled: topTruck.kmTravelled || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { message: "Error fetching statistics", error: error.message },
      { status: 500 }
    );
  }
}
