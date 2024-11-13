// Example API Route native db connection
import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import Users from "@/models/employees";
import clientPromise from "@/utils/mongo/mongodb";


export async function GET() {
  const { db } = await connectToDatabase();

  // Fetch all documents in the "works" collection
  const data = await db.collection("employees").find({}).toArray();

  // Return the data as a JSON response
  return NextResponse.json(data);
}


export async function POST(req) {
 
    try {
      const client = await clientPromise;
      const db = client.db("test");
      
      // Insert document into a collection
      const newUser = await req.json()
      const result = await db.collection("employees").insertOne(newUser);

      return NextResponse.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to insert document" });
    }

}
