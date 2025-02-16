// pages/api/insertEmployee.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Employee from '@/models/employees';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const {
      userId,
      email,
      name,
      age,
      current_journey,
      phoneNumber,
      gender,
      nationality,
      nationalID,
      passportNumber,
      occupation,
      kmtravelled,
      avg_km,
      journeys,
      opCosts,
      avg_op_costs,
      photo,
    } = await request.json();

    console.log('Inserting Employee:', {
      userId,
      email,
      name,
      age,
      current_journey,
      phoneNumber,
      gender,
      nationality,
      nationalID,
      passportNumber,
      occupation,
      kmtravelled,
      avg_km,
      journeys,
      opCosts,
      avg_op_costs,
      photo,
    });

    // Create a new Employee instance
    const newEmployee = new Employee({
      userId,
      email,
      name,
      age,
      current_journey,
      phoneNumber,
      gender,
      nationality,
      nationalID,
      passportNumber,
      occupation,
      kmtravelled,
      avg_km,
      journeys,
      opCosts,
      avg_op_costs,
      photo,
    });

    // Save to the database
    await newEmployee.save();

    return NextResponse.json({
      message: 'Employee added successfully',
      newEmployee,
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    return NextResponse.json(
      { message: 'Error adding employee', error: error.message },
      { status: 500 }
    );
  }
}

// Add GET handler to retrieve paginated and searchable employees
export async function GET(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse query parameters for pagination, search, and role
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1; // Default to page 1
    const limit = parseInt(searchParams.get('limit')) || 9; // Default limit to 9 items per page
    const search = searchParams.get('search') || ''; // Search query (empty by default)
    const role = searchParams.get('role') || ''; // Role filter (empty by default)

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

    if (role) {
      query.occupation = role; // Filter by selected role
    }

    // Fetch total count for pagination
    const totalEmployees = await Employee.countDocuments(query);

    // Fetch paginated employees based on the search and role filters
    const employees = await Employee.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });  // Sort by most recent

    // Calculate total pages
    const totalPages = Math.ceil(totalEmployees / limit);

    return NextResponse.json({
      employees,
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

// DELETE request handler
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('id');

    if (!employeeId) {
      return NextResponse.json(
        { message: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Employee deleted successfully',
      deletedEmployee,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { message: 'Error deleting employee', error: error.message },
      { status: 500 }
    );
  }
}

