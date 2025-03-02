import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    // Construct the filter query
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive name search
        { email: { $regex: search, $options: "i" } } // Case-insensitive email search
      ];
    }

    if (role) {
      filter.occupation = role; // Exact match for occupation
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch filtered users
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit);

    // Count total matching users
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Check if users exist
    if (!users.length) {
      return NextResponse.json(
        { message: "No users found." },
        { status: 404 }
      );
    }

    // Respond with paginated user data
    return NextResponse.json(
      {
        message: "Users retrieved successfully.",
        users: users.map(user => ({
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
