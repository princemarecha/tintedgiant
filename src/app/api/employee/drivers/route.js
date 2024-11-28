// pages/api/insertEmployee.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Employee from '@/models/employees';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      // Establish connection
      await connectToDatabase();
  
      // Parse query parameters for pagination and search
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page')) || 1; // Default to page 1
      const limit = parseInt(searchParams.get('limit')) || 9; // Default limit to 9 items per page
      const search = searchParams.get('search') || ''; // Search query (empty by default)
  
      // Calculate pagination
      const skip = (page - 1) * limit;
  
      // Build query object with occupation filter for "Driver" or "driver"
      let query = {
        occupation: { $regex: /^driver$/i }, // Case-insensitive exact match for "Driver"
      };
  
      // Add search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } }, // Case-insensitive match on name
        ];
      }
  
      // Fetch total count for pagination
      const totalEmployees = await Employee.countDocuments(query);
  
      // Fetch paginated employees with only name and id fields
      const employees = await Employee.find(query)
        .select("name _id") // Include only the name and _id fields
        .skip(skip)
        .limit(limit);
  
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
  