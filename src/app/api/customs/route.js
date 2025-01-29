// pages/api/insertCustoms.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Customs from '@/models/customs'; // Assumes Customs model is defined in '@/models/customs'
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const {
      date,
      status,
      reference,
      transporter,
      exporter,
      importer,
      trailerPlate,
      cargo,
      BOE,
      horse_plate,
      trailer_plate,
      invoice,
      duty,
      duty_currency,
      attachments, // Added attachments field for storing image URLs
    } = await request.json();

    console.log('Inserting Customs Entry:', {
      date,
      status,
      reference,
      transporter,
      exporter,
      importer,
      trailerPlate,
      cargo,
      BOE,
      horse_plate,
      trailer_plate,
      invoice,
      duty,
      duty_currency,
      attachments,
    });

    // Create a new Customs entry
    const newCustoms = new Customs({
      date,
      status,
      reference,
      transporter,
      exporter,
      importer,
      trailerPlate,
      cargo,
      BOE,
      horse_plate,
      trailer_plate,
      invoice,
      duty,
      duty_currency,
      attachments, // Store the attachments URLs here
    });

    // Save to the database
    await newCustoms.save();

    return NextResponse.json({
      message: 'Customs entry added successfully',
      newCustoms,
    });
  } catch (error) {
    console.error('Error adding customs entry:', error);
    return NextResponse.json(
      { message: 'Error adding customs entry', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Parse query parameters
    const { search = '', filter = '', page = 1, limit = 10 } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    // Connect to the database
    await connectToDatabase();

    // Build query object
    const query = {};

    // Add search condition
    if (search) {
      query.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { exporter: { $regex: search, $options: 'i' } },
        { importer: { $regex: search, $options: 'i' } },
        { transporter: { $regex: search, $options: 'i' } },
      ];
    }

    // Add filter condition for "status" instead of "cleared"
    if (filter) {
      query.status = filter; // Matches the exact value of 'status' field
    }

    // Fetch filtered, paginated, and sorted results
    const totalEntries = await Customs.countDocuments(query);
    const customsEntries = await Customs.find(query)
      .sort({ createdAt: -1 }) // Latest entries first
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Prepare response
    return NextResponse.json({
      data: customsEntries,
      pagination: {
        totalEntries,
        totalPages: Math.ceil(totalEntries / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error('Error fetching customs entries:', error);
    return NextResponse.json(
      { message: 'Error fetching customs entries', error: error.message },
      { status: 500 }
    );
  }
}

