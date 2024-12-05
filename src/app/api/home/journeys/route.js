// pages/api/insertJourney.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

// Add GET handler to retrieve all "In Progress" journeys and their count
export async function GET(req) {
    try {
      // Establish connection
      await connectToDatabase();
  
      // Fetch all journeys with status "In Progress" sorted from latest to oldest
      const journeys = await Journey.find({ status: "In Progress" }).sort({ _id: -1 });
  
      // Get the total count of journeys with status "In Progress"
      const totalJourneys = await Journey.countDocuments({ status: "In Progress" });
  
      // Return response with all journeys and their count
      return NextResponse.json({
        journeys,
        totalJourneys,
      });
    } catch (error) {
      console.error("Error fetching journeys:", error);
      return NextResponse.json(
        { message: "Error fetching journeys", error: error.message },
        { status: 500 }
      );
    }
  }
  