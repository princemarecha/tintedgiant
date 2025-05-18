// pages/api/insertTruck.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '../../../../models/trucks';
import { NextResponse } from 'next/server';
import Journey from '../../../../models/journey';

// Add GET handler to retrieve all trucks
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 9;
    const search = searchParams.get("search") || "";
    const make = searchParams.get("make") || "";
    const skip = (page - 1) * limit;

    // Base truck query
    const baseQuery = {};
    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { plate_id: { $regex: search, $options: "i" } }
      ];
    }
    if (make) {
      baseQuery.make = make;
    }

    // Fetch all matching trucks
    const allTrucks = await Truck.find(baseQuery).select("name plate_id");

    const eligibleTrucks = [];

    for (const truck of allTrucks) {
      // Check for any journey with this truck that is not 'Arrived'
      const activeJourney = await Journey.findOne({
        "truck.plate_id": truck.plate_id,
        status: { $ne: "Arrived" },
      });

      if (!activeJourney) {
        eligibleTrucks.push(truck);
      }
    }

    const totalTrucks = eligibleTrucks.length;
    const totalPages = Math.ceil(totalTrucks / limit);
    const paginatedTrucks = eligibleTrucks.slice(skip, skip + limit);

    return NextResponse.json({
      trucks: paginatedTrucks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTrucks,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    return NextResponse.json(
      { message: "Error fetching trucks", error: error.message },
      { status: 500 }
    );
  }
}

