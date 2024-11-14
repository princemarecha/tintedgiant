import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {reference} = await params
  
  console.log(reference)

  // Fetch the clearance document using the specified field
  const data = await db.collection("customs").findOne({ reference: reference });

  // Return the clearance data as a JSON response
  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {reference} = await params

  console.log("Deleting clearance with clearance ID:", reference);

  // Delete the clearance document using the specified national ID
  const result = await db.collection("customs").deleteOne({ reference: reference });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "clearance not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "clearance deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {reference} = await params

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating clearance with clearance ID:", reference, "with fields:", updates);

  // Update the clearance document with the provided fields
  const result = await db.collection("customs").updateOne(
    { reference: reference },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "clearance not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "clearance updated successfully" });
}
