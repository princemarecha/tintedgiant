// pages/api/insertTruck.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '@/models/trucks';
import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { name,make, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos } = await request.json();

    console.log('Inserting Truck:', name,make, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos);

    // Create a new Truck instance
    const newTruck = new Truck({ name,make, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos });

    // Save to the database
    await newTruck.save();

    return NextResponse.json({ message: 'Truck added successfully', newTruck });
  } catch (error) {
    console.error('Error adding truck:', error);
    return NextResponse.json({ message: 'Error adding truck', error: error.message }, { status: 500 });
  }
}


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
    const make = searchParams.get('make') || ''; // make filter (empty by default)

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
    const totaltrucks = await Truck.countDocuments(query);

    // Fetch paginated trucks based on the search and make filters
    const trucks = await Truck.find(query)
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totaltrucks / limit);

    return NextResponse.json({
      trucks,
      pagination: {
        currentPage: page,
        totalPages,
        totaltrucks,
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
