import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken");

  if (!token || !token.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isValid = await validateToken(token.value);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: 1,
        name: "challenge2025",
        email: "challenge2025@arbolitics.com",
        company: { name: "Birre Soft" },
      },
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Example token validation function
async function validateToken(token: string): Promise<boolean> {
  // Need to implement real token validation logic here
  console.warn(
    "Token validation is currently skipped. Implement real validation logic later."
  );
  return true; // Assume token is valid for now
}
