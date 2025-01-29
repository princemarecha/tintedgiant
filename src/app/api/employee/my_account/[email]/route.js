import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Extract `email` from context.params
  const { params } = context;
  const { email } = params;

  console.log("Fetching employee with email:", email);

  // Fetch the employee document using `email`
  const data = await db.collection("employees").findOne({ email });

  if (!data) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { email } = params;

  console.log("Deleting employee with email:", email);

  // Delete the employee document using `email`
  const result = await db.collection("employees").deleteOne({ email });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { email } = params;

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating employee with email:", email, "with fields:", updates);

  // Update the employee document with the provided fields using `email`
  const result = await db.collection("employees").updateOne(
    { email },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee updated successfully" });
}
