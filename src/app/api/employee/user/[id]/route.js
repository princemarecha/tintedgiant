// app/api/user/[id]/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";

export async function GET(req, { params }) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract the user ID from the params
    const { id } = params;

    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await User.findById(id);

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Respond with the user data
    return NextResponse.json(
      {
        message: "User retrieved successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the user.", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract the user ID from the params
    const { id } = params;

    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await req.json();

    // Validate the request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { message: "No data provided for update." },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    });

    // Check if the user exists
    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    // Respond with the updated user data
    return NextResponse.json(
      {
        message: "User updated successfully.",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the user.", error: error.message },
      { status: 500 }
    );
  }
}
