import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET method: Fetch a single journey by journey_id
export async function GET(req, { params }) {
  const { db } = await connectToDatabase();

  //console.log("Received params:", params); // Log the params object for debugging

  const { journey_id } = await params; // Extract `journey_id` from `params`

  try {
    if (!journey_id) {
      return NextResponse.json({ message: "Journey ID is required" }, { status: 400 });
    }

    // Fetch the journey by its `journey_id`
    const journey = await db.collection("journeys").findOne({ _id: new ObjectId(journey_id) });

    if (!journey) {
      return NextResponse.json({ message: "Journey not found" }, { status: 404 });
    }

    return NextResponse.json(journey); // Return the journey
  } catch (error) {
    console.error("Error fetching journey:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH method: Update a single journey by journey_id
export async function PATCH(req, { params }) {
  const { db } = await connectToDatabase();
  const { journey_id } = await params; // Extract `journey_id` from `params`

  try {
    if (!journey_id) {
      return NextResponse.json({ message: "Journey ID is required" }, { status: 400 });
    }

    // Parse the request body for updates
    const updates = await req.json();

    // Update the journey document
    const result = await db.collection("journeys").updateOne(
      { _id: new ObjectId(journey_id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Journey not found" }, { status: 404 });
    }

    // Fetch the updated journey
    const updatedJourney = await db.collection("journeys").findOne({ _id: new ObjectId(journey_id) });

    return NextResponse.json({
      message: "Journey updated successfully",
      journey: updatedJourney,
    });
  } catch (error) {
    console.error("Error updating journey:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

