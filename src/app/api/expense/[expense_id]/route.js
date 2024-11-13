import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  // Access empID directly from context.params
  const {params} = context;

  const {expense_id} = await params
  
  console.log(expense_id)

  // Fetch the expense document using the specified field
  const data = await db.collection("expenses").findOne({ expense_id: expense_id });

  // Return the expense data as a JSON response
  return NextResponse.json(data);
}

export async function DELETE(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {expense_id} = await params

  console.log("Deleting expense with expense ID:", expense_id);

  // Delete the expense document using the specified national ID
  const result = await db.collection("expenses").deleteOne({ expense_id: expense_id });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "expense not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "expense deleted successfully" });
}

export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const {params} = context;

  const {expense_id} = await params

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating expense with expense ID:", expense_id, "with fields:", updates);

  // Update the expense document with the provided fields
  const result = await db.collection("expenses").updateOne(
    { expense_id: expense_id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "expense not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "expense updated successfully" });
}
