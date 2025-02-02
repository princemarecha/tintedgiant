import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectToDatabase from "@/utils/mongo/mongoose";
import User from "@/models/users";
import { SignJWT, jwtVerify } from "jose"; // ✅ Replace `jsonwebtoken` with `jose`

// Create a secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Compare password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // ✅ Generate JWT token using `jose`
    const token = await new SignJWT({ userId: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secretKey);

    // Create response and set cookie
    const response = NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          occupation: user.occupation,
        },
      },
      { status: 200 }
    );

    // Set token in an HTTP-only cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: "An error occurred during login.", error: error.message }, { status: 500 });
  }
}
