import { connectToDatabase } from "@/utils/mongo";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId to handle MongoDB IDs

export async function GET(req, context) {
  const { db } = await connectToDatabase();

  const { params } = context;
  const { id } = await params;

  console.log("Fetching employee with userId:", id);

  // Fetch employee by userId
  const employee = await db.collection("employees").findOne({ userId: id });

  if (!employee) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  // Check if employee is a driver by looking for an active journey
  const journey = await db.collection("journeys").findOne({
    'driver.id': id,
    status: { $ne: 'Arrived' },
  });

  // Append journey if found
  if (journey) {
    employee.journey = journey;
  }

  return NextResponse.json(employee);
}

export async function DELETE(request, context) {
  try {
    const { db } = await connectToDatabase();

    const { params } = context;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Employee ID is required' },
        { status: 400 }
      );
    }

    console.log(`Deleting Employee and User with ID: ${id}`);

    // Delete employee from "employees" collection
    const employeeResult = await db.collection("employees").deleteOne({ userId: id });

    if (employeeResult.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }

    // Delete user from "users" collection
    const userResult = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    console.log(
      userResult.deletedCount > 0
        ? `Deleted User associated with Employee ID: ${id}`
        : 'No matching user found in the users collection'
    );

    return NextResponse.json({
      message: 'Employee and associated user deleted successfully',
      deletedEmployeeCount: employeeResult.deletedCount,
      deletedUserCount: userResult.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { message: 'Error deleting employee', error: error.message },
      { status: 500 }
    );
  }
}


export async function PATCH(req, context) {
  const { db } = await connectToDatabase();
  const { params } = context;
  const { id } = params;

  // Parse the request body for updated fields
  const updates = await req.json();

  console.log("Updating employee with userId:", id, "with fields:", updates);

  // Update the employee document with the provided fields using `userId`
  const result = await db.collection("employees").updateOne(
    { userId: id },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Employee updated successfully" });
}
