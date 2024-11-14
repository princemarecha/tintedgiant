// pages/api/insertCustoms.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Customs from '@/models/customs'; // Assumes Customs model is defined in '@/models/customs'
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { date, reference, transporter, exporter, importer, trailerPlate, cargo, status, BOE, horse_plate, trailer_plate, invoice, invoice_photo, duty } = await request.json();

    console.log('Inserting Customs Entry:', { date, reference, transporter, exporter, importer, trailerPlate, cargo, status, BOE, horse_plate, trailer_plate, invoice, invoice_photo, duty });

    // Create a new Customs entry
    const newCustoms = new Customs({
      date,
      reference,
      transporter,
      exporter,
      importer,
      trailerPlate,
      cargo,
      status,
      BOE,
      horse_plate,
      trailer_plate,
      invoice,
      invoice_photo,
      duty
    });

    // Save to the database
    await newCustoms.save();

    return NextResponse.json({ message: 'Customs entry added successfully', newCustoms });
  } catch (error) {
    console.error('Error adding customs entry:', error);
    return NextResponse.json({ message: 'Error adding customs entry', error: error.message }, { status: 500 });
  }
}

// Add GET handler to retrieve all customs entries
export async function GET() {
  try {
    // Establish connection
    await connectToDatabase();

    // Fetch all customs entries
    const customsEntries = await Customs.find({});

    return NextResponse.json({ customsEntries });
  } catch (error) {
    console.error('Error fetching customs entries:', error);
    return NextResponse.json({ message: 'Error fetching customs entries', error: error.message }, { status: 500 });
  }
}
