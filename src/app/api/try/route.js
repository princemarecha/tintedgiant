// Example API Route
import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  const { db } = await connectToDatabase();

  // Fetch all documents in the "works" collection
  const data = await db.collection("works").find({}).toArray();

  // Return the data as a JSON response
  return NextResponse.json(data);
}