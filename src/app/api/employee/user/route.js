// app/api/user/route.js
import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract query parameters for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 users per page

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await User.find({})
      .skip(skip)
      .limit(limit);

    // Count total users
    const totalUsers = await User.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Check if users exist
    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "No users found." },
        { status: 404 }
      );
    }

    // Respond with paginated user data
    return NextResponse.json(
      {
        message: "Users retrieved successfully.",
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          occupation: user.occupation,
        })),
        totalPages,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching users.", error: error.message },
      { status: 500 }
    );
  }
}
