import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";

// PATCH request to update name, email, and occupation
export async function PATCH(req, context) {
  try {
    await connectToDatabase();

    // Extract user ID from the URL
    //const id = req.nextUrl.pathname.split("/").pop(); // Assumes route is `/api/user/[id]`

    const { params } = context;
    const { id } = params;
  

    if (!id) {
      return NextResponse.json({ message: "User ID is required in the URL." }, { status: 400 });
    }

    // Extract fields from request body
    const { name, email, occupation } = await req.json();
    
    if (!name && !email && !occupation) {
      return NextResponse.json({ message: "At least one field (name, email, occupation) must be provided." }, { status: 400 });
    }

    // Construct update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (occupation) updateFields.occupation = occupation;

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "An error occurred while updating the user.", error: error.message }, { status: 500 });
  }
}
