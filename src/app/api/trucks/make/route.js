import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '@/models/trucks';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
      // Establish connection
      await connectToDatabase();
  
      // Fetch unique make values
      const uniqueMake = await Truck.distinct("make");
  
      // Return response with unique make values
      return NextResponse.json({
        makeTypes: uniqueMake,
      });
    } catch (error) {
      console.error("Error fetching make types:", error);
      return NextResponse.json(
        { message: "Error fetching make types", error: error.message },
        { status: 500 }
      );
    }
  }
  