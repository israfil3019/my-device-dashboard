import { Url } from "@/lib/constants/url.enum";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Client } from "undici";
import logger from "@/lib/hooks/logger";
import { parse } from "cookie"; // To parse cookies manually

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const targetUrl = Url.DATA;

  try {
    const { location_id, limit } = await req.json();

    // Get token from cookies
    const cookies = req.headers.get("cookie");
    const parsedCookies = cookies ? parse(cookies) : {};
    const token = parsedCookies.authToken;

    if (!token) {
      return NextResponse.json(
        { error: "Missing ACCESS_TOKEN" },
        { status: 401 } // Unauthorized
      );
    }

    if (!location_id || !limit) {
      return NextResponse.json(
        { error: "Missing required parameters: location_id or limit" },
        { status: 400 }
      );
    }

    const client = new Client(new URL(targetUrl).origin, {
      connect: {
        rejectUnauthorized: false,
      },
    });

    const { body: responseBody, statusCode } = await client.request({
      path: new URL(targetUrl).pathname,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ location_id, limit }),
    });

    const data = await responseBody.json();

    return NextResponse.json(data, { status: statusCode });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Proxy error", { error: error.message, stack: error.stack });
    } else {
      logger.error("Proxy error", { error: String(error) });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "X-Debug-Error":
            error instanceof Error ? error.message : "Unknown error",
        },
      }
    );
  }
}
