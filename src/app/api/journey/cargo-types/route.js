import connectToDatabase from '@/utils/mongo/mongoose';
import Journey from '@/models/journey'; // Assumes Journey model is correctly defined in '@/models/journey'
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
      // Establish connection
      await connectToDatabase();
  
      // Fetch unique cargo values
      const uniqueCargo = await Journey.distinct("cargo");
  
      // Return response with unique cargo values
      return NextResponse.json({
        cargoTypes: uniqueCargo,
      });
    } catch (error) {
      console.error("Error fetching cargo types:", error);
      return NextResponse.json(
        { message: "Error fetching cargo types", error: error.message },
        { status: 500 }
      );
    }
  }
  