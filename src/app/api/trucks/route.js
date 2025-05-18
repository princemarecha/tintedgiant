// pages/api/insertTruck.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Truck from '../../../models/trucks';
import Journey from '../../../models/journey';
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
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const search = searchParams.get('search') || '';
    const make = searchParams.get('make') || '';
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }
    if (make) {
      query.make = make;
    }

    const totaltrucks = await Truck.countDocuments(query);

    const trucks = await Truck.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const enrichedTrucks = await Promise.all(
      trucks.map(async (truck) => {
        // Find any journey associated with this truck
        const journey = await Journey.findOne({
          'truck.plate_id': truck.plate_id,
        })
          .select('from to driver.name status')
          .lean();

        // Count all journeys associated with this truck
        const journeyCount = await Journey.countDocuments({
          'truck.plate_id': truck.plate_id,
        });

        // Determine new status
        let newStatus = 'Standby';
        if (journey && journey.status !== 'Arrived') {
          newStatus = 'Travelling';
        }

        let updated = false;

        if (truck.status !== newStatus) {
          truck.status = newStatus;
          updated = true;
        }

        if (truck.journeys !== journeyCount) {
          truck.journeys = journeyCount;
          updated = true;
        }

        if (updated) {
          await truck.save();
        }

        return {
          ...truck.toObject(),
          status: newStatus,
          journeys: journeyCount,
          journey: journey
            ? {
                from: journey.from || null,
                to: journey.to || null,
                driver: journey.driver?.name || null,
              }
            : null,
        };
      })
    );

    const totalPages = Math.ceil(totaltrucks / limit);

    return NextResponse.json({
      trucks: enrichedTrucks,
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

