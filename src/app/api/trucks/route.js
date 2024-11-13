// pages/api/insertTruck.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '@/models/trucks';
import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     // Establish connection
//     await connectToDatabase();

//     // Parse the JSON body
//     const { name, status, location, travelling, trailer, trailerPlate, colour, plateID, mileage, fuel, journeys, avgKM, opCosts,avgOpCosts,photos } = await request.json();

//     console.log('Inserting Truck:', name, status, location, travelling, trailer, trailerPlate, colour, plateID, mileage, fuel, journeys, avgKM, opCosts,avgOpCosts,photos);

//     // Create a new Truck instance
//     const newTruck = new Truck({ name, status, location, travelling, trailer, trailerPlate, colour, plateID, mileage, fuel, journeys, avgKM, opCosts,avgOpCosts,photos });

//     // Save to the database
//     await newTruck.save();

//     return NextResponse.json({ message: 'Truck added successfully', newTruck });
//   } catch (error) {
//     console.error('Error adding truck:', error);
//     return NextResponse.json({ message: 'Error adding truck', error: error.message }, { status: 500 });
//   }
// }

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { name, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos } = await request.json();

    console.log('Inserting Truck:', name, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos);

    // Create a new Truck instance
    const newTruck = new Truck({ name, status, location, travelling, trailer, trailerPlate, colour, plate_id, mileage, fuel, journeys, avg_km, opCosts, avg_opCosts, photos });

    // Save to the database
    await newTruck.save();

    return NextResponse.json({ message: 'Truck added successfully', newTruck });
  } catch (error) {
    console.error('Error adding truck:', error);
    return NextResponse.json({ message: 'Error adding truck', error: error.message }, { status: 500 });
  }
}


// Add GET handler to retrieve all trucks
export async function GET() {
  try {
    // Establish connection
    await connectToDatabase();

    // Fetch all trucks
    const trucks = await Truck.find({});

    return NextResponse.json({ trucks });
  } catch (error) {
    console.error('Error fetching trucks:', error);
    return NextResponse.json({ message: 'Error fetching trucks', error: error.message }, { status: 500 });
  }
}
