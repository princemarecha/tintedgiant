// pages/api/insertEmployee.js
import connectToDatabase from '@/utils/mongo/mongoose';
import Employee from '@/models/employees';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Establish connection
    await connectToDatabase();

    // Parse the JSON body
    const { name, age, gender, nationality,nationalID,passportNumber,occupation,kmtravelled,avg_km,journeys,opCosts,avg_op_costs, photo } = await request.json();
    const pig  = await request.json()
    console.log(pig)

    console.log('Inserting Employeee:', name, age, gender, nationality,nationalID,passportNumber,occupation,kmtravelled,avg_km,journeys,opCosts,avg_op_costs, photo );

    // Create a new Employee instance
    const newEmployee = new Employee({ name, age, gender, nationality,nationalID,passportNumber,occupation,kmtravelled,avg_km,journeys,opCosts,avg_op_costs, photo });

    // Save to the database
    await newEmployee.save();

    return NextResponse.json({ message: 'Employee added successfully', newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    const { photo

     } = await request.json();

    console.log('Failed to insert:', photo );

    return NextResponse.json({ message: 'Error adding employee', error: error.message }, { status: 500 });
  }
}
