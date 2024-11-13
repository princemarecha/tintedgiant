import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {plate_id} = await params
  console.log(plate_id)

  // Fetch the truck document using the specified field
  const data = await db.collection("trucks").findOne({ plateID: plate_id });

  // Return the truck data as a JSON response
  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {plate_id} = await params

  console.log("Deleting truck with national ID:", plate_id);

  // Delete the truck document using the specified national ID
  const result = await db.collection("trucks").deleteOne({ nationalID: plate_id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "truck not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "truck deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {plate_id} = await params

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating truck with national ID:", plate_id, "with fields:", updates);

  // Update the truck document with the provided fields
  const result = await db.collection("trucks").updateOne(
    { nationalID: plate_id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "truck not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "truck updated successfully" });
}
