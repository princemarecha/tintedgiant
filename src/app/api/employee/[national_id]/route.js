import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {national_id} = await params
  console.log(national_id)

  // Fetch the employee document using the specified field
  const data = await db.collection("employees").findOne({ nationalID: national_id });

  // Return the employee data as a JSON response
  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {national_id} = await params

  console.log("Deleting employee with national ID:", national_id);

  // Delete the employee document using the specified national ID
  const result = await db.collection("employees").deleteOne({ nationalID: national_id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {national_id} = await params

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating employee with national ID:", national_id, "with fields:", updates);

  // Update the employee document with the provided fields
  const result = await db.collection("employees").updateOne(
    { nationalID: national_id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee updated successfully" });
}
