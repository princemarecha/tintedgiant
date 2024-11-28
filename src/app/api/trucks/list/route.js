// pages/api/insertTruck.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '@/models/trucks';
import { NextResponse } from 'next/server';

// Add GET handler to retrieve all trucks
export async function GET(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse query parameters for pagination, search, and make
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1; // Default to page 1
    const limit = parseInt(searchParams.get('limit')) || 9; // Default limit to 9 items per page
    const search = searchParams.get('search') || ''; // Search query (empty by default)
    const make = searchParams.get('make') || ''; // Make filter (empty by default)

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query object
    let query = {};
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive match on name
        ],
      };
    }

    if (make) {
      query.make = make; // Filter by selected make
    }

    // Fetch total count for pagination
    const totalTrucks = await Truck.countDocuments(query);

    // Fetch paginated trucks with only name and plate_id fields
    const trucks = await Truck.find(query)
      .select("name plate_id") // Include only the name and plate_id fields
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalTrucks / limit);

    return NextResponse.json({
      trucks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTrucks,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching trucks:', error);
    return NextResponse.json(
      { message: 'Error fetching trucks', error: error.message },
      { status: 500 }
    );
  }
}
