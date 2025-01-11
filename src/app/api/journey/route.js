// pages/api/insertJourney.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { from, to, departure, arrival, cargo, expense, delivered, distance, status, truck, driver } = await request.json();

    console.log('Inserting Journey:', { from, to, departure, arrival, cargo, expense, delivered, distance, status, truck, driver });

    // Create a new Journey instance
    const newJourney = new Journey({
      from,
      to,
      departure,
      arrival,
      cargo,
      expense,
      delivered,
      distance,
      status,
      truck,
      driver
    });

    // Save to the database
    await newJourney.save();

    return NextResponse.json({ message: 'Journey added successfully', newJourney });
  } catch (error) {
    console.error('Error adding journey:', error);
    return NextResponse.json({ message: 'Error adding journey', error: error.message }, { status: 500 });
  }
}

// Add GET handler to retrieve all journeys
export async function GET(req) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1 if not provided
    const search = searchParams.get("search") || ""; // Default to an empty string
    const type = searchParams.get("type") || ""; // Default to an empty string
    const itemsPerPage = 4; // Items per page

    // Calculate the number of items to skip
    const skip = (page - 1) * itemsPerPage;

    // Build the query dynamically
    const query = {};
    if (search) {
      query.$or = [
        { from: { $regex: search, $options: "i" } },       // Case-insensitive search in 'from'
        { to: { $regex: search, $options: "i" } },         // Case-insensitive search in 'to'
        { "driver.name": { $regex: search, $options: "i" } } // Case-insensitive search in 'driver.name'
      ];
    }
    if (type) {
      query.cargo = { $regex: type, $options: "i" }; // Match 'type' against the 'cargo' field
    }


    // Fetch paginated results
    const journeys = await Journey.find(query)
      .sort({ _id: -1 }) // Sort in descending order by ID
      .skip(skip)
      .limit(itemsPerPage);

    // Get the total count of documents matching the query
    const totalJourneys = await Journey.countDocuments(query);

    // Return response with pagination info
    return NextResponse.json({
      journeys,
      pagination: {
        currentPage: page,
        itemsPerPage,
        totalJourneys,
        totalPages: Math.ceil(totalJourneys / itemsPerPage),
      },
    });
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return NextResponse.json(
      { message: "Error fetching journeys", error: error.message },
      { status: 500 }
    );
  }
}
