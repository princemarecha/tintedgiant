import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {journey_id} = await params
  
  console.log(journey_id)

  // Fetch the journey document using the specified field
  const data = await db.collection("journeys").findOne({ journey_id: journey_id });

  // Return the journey data as a JSON response
  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {journey_id} = await params

  console.log("Deleting journey with journey ID:", journey_id);

  // Delete the journey document using the specified national ID
  const result = await db.collection("journeys").deleteOne({ journey_id: journey_id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "journey not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "journey deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {journey_id} = await params

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating journey with journey ID:", journey_id, "with fields:", updates);

  // Update the journey document with the provided fields
  const result = await db.collection("journeys").updateOne(
    { journey_id: journey_id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "journey not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "journey updated successfully" });
}
