import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload; // Returns decoded token data
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return null;
  }
}
