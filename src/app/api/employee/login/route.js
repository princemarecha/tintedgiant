// app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Parse request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Respond with success and token
    return NextResponse.json(
      {
        message: "Login successful.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          occupation: user.occupation,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "An error occurred during login.", error: error.message },
      { status: 500 }
    );
  }
}
