import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  const { params } = context;
  const { plate_id } = params;

  console.log('Requested plate_id:', plate_id);

  // Fetch the truck
  const truck = await db.collection('trucks').findOne({ plate_id });

  if (!truck) {
    return NextResponse.json({ message: 'Truck not found' }, { status: 404 });
  }

  // Fetch associated journey if its status is NOT "Arrived"
  const journey = await db.collection('journeys').findOne({
    'truck.plate_id': plate_id,
    status: { $ne: 'Arrived' },
  });

  // Append full journey object if it exists
  if (journey) {
    truck.journey = journey;
  }

  return NextResponse.json(truck);
}


export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {plate_id} = await params

  console.log("Deleting truck with national ID:", plate_id);

  // Delete the truck document using the specified national ID
  const result = await db.collection("trucks").deleteOne({ plate_id: plate_id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "truck not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "truck deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { plate_id } = await params;

  const url = new URL(req.url);
  const kmParam = url.searchParams.get("km");
  const journeyId = url.searchParams.get("journeyId");
  const kmToAdd = parseInt(kmParam || "0", 10);

  const updatesFromBody = await req.json();

  // Fetch the truck
  const truck = await db.collection("trucks").findOne({ plate_id });

  if (!truck) {
    return NextResponse.json({ message: "Truck not found" }, { status: 404 });
  }

  // Default to 0 if not numeric
  const currentJourneys = isFinite(truck.journeys) ? truck.journeys : 0;
  const currentKilometers = isFinite(truck.kilometers) ? truck.kilometers : 0;

  const newJourneys = currentJourneys + (journeyId ? 1 : 0);
  const newKilometers = currentKilometers + (journeyId && !isNaN(kmToAdd) ? kmToAdd : 0);
  const avgKm = newJourneys > 0 ? newKilometers / newJourneys : 0;

  const updatePayload = {
    $set: {
      ...updatesFromBody,
      ...(journeyId && {
        journeys: newJourneys,
        kilometers: newKilometers,
        avg_km: avgKm,
      }),
    },
  };

  const result = await db.collection("trucks").updateOne(
    { plate_id },
    updatePayload
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Truck not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Truck updated successfully" });
}
