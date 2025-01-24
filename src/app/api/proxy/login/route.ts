import { Url } from "@/lib/constants/url.enum";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import logger from "@/lib/hooks/logger";

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const targetUrl = Url.LOGIN;

  try {
    const body = await req.json();

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    // logger.info("Response received from target API", {
    //   status: response.status,
    //   response: data,
    // });

    if (response.ok && data?.data?.accessToken) {
      const token = data.data.accessToken;

      // Set the token as an HTTP-only cookie
      const nextResponse = NextResponse.json(
        { success: true, message: "Login successful" },
        { status: response.status }
      );

      nextResponse.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return nextResponse;
    }

    // Handle invalid credentials or missing token
    return NextResponse.json(
      { success: false, message: "Invalid credentials or missing token" },
      { status: response.status || 400 }
    );
  } catch (error) {
    // Log and return a generic error message
    if (error instanceof Error) {
      logger.error("Proxy error", {
        message: error.message,
        stack: error.stack,
      });
    } else {
      logger.error("Unknown proxy error", { error });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
