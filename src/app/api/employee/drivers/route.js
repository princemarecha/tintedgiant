// pages/api/insertEmployee.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Employee from '@/models/employees';
import { NextResponse } from 'next/server';
import Journey from '@/models/journey';

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9;
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const baseQuery = {
      occupation: { $regex: /^driver$/i },
    };

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch all matching drivers first
    const allDrivers = await Employee.find(baseQuery).select('name _id userId');

    const filteredDrivers = [];

    for (const driver of allDrivers) {
      // Check if driver has any journeys that are NOT 'Arrived'
      const activeJourney = await Journey.findOne({
        'driver.id': driver.userId,
        status: { $ne: 'Arrived' },
      });

      // If no active journey, include this driver
      if (!activeJourney) {
        filteredDrivers.push(driver);
      }
    }

    const totalEmployees = filteredDrivers.length;
    const totalPages = Math.ceil(totalEmployees / limit);
    const paginatedDrivers = filteredDrivers.slice(skip, skip + limit);

    return NextResponse.json({
      employees: paginatedDrivers,
      pagination: {
        currentPage: page,
        totalPages,
        totalEmployees,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { message: 'Error fetching employees', error: error.message },
      { status: 500 }
    );
  }
}
