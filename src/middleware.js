import { NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next(); // Continue to the requested page
}

export const config = {
  matcher:  ["/", "/employees/:path*", "/trucks/:path*", "/expenses/:path*", "/journeys/:path*", "/customs/:path*","/my_account/:path*"], // Protected routes
};
