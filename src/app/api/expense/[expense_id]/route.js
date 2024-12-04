import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { db } = await connectToDatabase();
  const { expense_id } = await params; // Extract `expense_id` from `params`


  console.log("Expense ID:", expense_id);

  try {
    // Validate expense_id format
    if (!expense_id || !ObjectId.isValid(expense_id)) {
      return NextResponse.json({ message: "Invalid Expense ID" }, { status: 400 });
    }

    // Convert expense_id to ObjectId
    const expense = await db.collection("expenses").findOne({ _id: new ObjectId(expense_id) });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense); // Return the expense
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE method: Delete a single expense by _id
export async function DELETE(req, { params }) {
  const { db } = await connectToDatabase();
  const { expense_id } = await params; // Extract `expense_id` from `params`

  try {
    if (!expense_id) {
      return NextResponse.json({ message: "Expense ID is required" }, { status: 400 });
    }

    // Delete the expense by its `_id`
    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(expense_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH method: Update a single expense by _id
export async function PATCH(req, { params }) {
  const { db } = await connectToDatabase();
  const { expense_id } = await params; // Extract `expense_id` from `params`
  console.log("Patching this and this"+ expense_id)

  try {
    if (!expense_id) {
      return NextResponse.json({ message: "Expense ID is required" }, { status: 400 });
    }

    // Parse the request body for updates
    const updates = await req.json();

    // Update the expense document
    const result = await db.collection("expenses").updateOne(
      { _id: new ObjectId(expense_id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    // Fetch the updated expense
    const updatedExpense = await db.collection("expenses").findOne({ _id: new ObjectId(expense_id) });

    return NextResponse.json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
