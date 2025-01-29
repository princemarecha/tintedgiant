import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Extract `id` from context.params
  const { params } = context;
  const { id } = params;

  console.log("Fetching employee with userId:", id);

  // Fetch the employee document using `userId`
  const data = await db.collection("employees").findOne({ userId: id });

  if (!data) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { id } = params;

  console.log("Deleting employee with userId:", id);

  // Delete the employee document using `userId`
  const result = await db.collection("employees").deleteOne({ userId: id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { id } = params;

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating employee with userId:", id, "with fields:", updates);

  // Update the employee document with the provided fields using `userId`
  const result = await db.collection("employees").updateOne(
    { userId: id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee updated successfully" });
}
