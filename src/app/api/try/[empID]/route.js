import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {empID} = await params
  console.log(typeof(empID))

  // Fetch the employee document using the specified field
  const data = await db.collection("employees").find({ empID: parseInt(empID) }).toArray();

  // Return the employee data as a JSON response
  return NextResponse.json(data);
}
