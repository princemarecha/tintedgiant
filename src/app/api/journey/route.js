// pages/api/insertJourney.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { from, to, departure, arrival, cargo, expense, delivered, journey_id, distance, status, truck, driver } = await request.json();

    console.log('Inserting Journey:', { from, to, departure, arrival, cargo, expense, delivered, journey_id, distance, status, truck, driver });

    // Create a new Journey instance
    const newJourney = new Journey({
      from,
      to,
      departure,
      arrival,
      cargo,
      expense,
      delivered,
      journey_id,
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
export async function GET() {
  try {
    // Establish connection
    await connectToDatabase();

    // Fetch all journeys
    const journeys = await Journey.find({});

    return NextResponse.json({ journeys });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return NextResponse.json({ message: 'Error fetching journeys', error: error.message }, { status: 500 });
  }
}
