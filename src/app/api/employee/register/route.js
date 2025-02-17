// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request body
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email is already in use." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    var occupation = "";

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      occupation,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with success, including the user ID
    return NextResponse.json(
      {
        message: "User registered successfully.",
        userId: savedUser._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred during registration.", error: error.message },
      { status: 500 }
    );
  }
}
