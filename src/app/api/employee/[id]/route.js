import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Extract `id` from context.params
  const { params } = context;
  const { id } = await params;
 await
  console.log("Fetching employee with ID:", id);

  // Convert `id` to ObjectId
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  // Fetch the employee document using `_id`
  const data = await db.collection("employees").findOne({ _id: objectId });

  if (!data) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { id } = await params;

  console.log("Deleting employee with ID:", id);

  // Convert `id` to ObjectId
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  // Delete the employee document using `_id`
  const result = await db.collection("employees").deleteOne({ _id: objectId });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { id } = await params;

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating employee with ID:", id, "with fields:", updates);

  // Convert `id` to ObjectId
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (error) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  // Update the employee document with the provided fields
  const result = await db.collection("employees").updateOne(
    { _id: objectId },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee updated successfully" });
}
