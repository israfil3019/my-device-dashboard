import { Url } from "@/lib/constants/url.enum";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Client } from "undici";

// const ACCESS_TOKEN = localStorage.getItem("token");
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjI5LCJlbWFpbCI6ImNoYWxsZW5nZTIwMjVAYXJib2xpdGljcy5jb20iLCJyb2xlIjoiVEVTVCIsImlhdCI6MTczNzU2MzI0MywiZXhwIjoxNzM4MTY4MDQzfQ.tZGim4ZUzTfWgZxkFb2na0xR9BJuRJYMfy-46_KpsQo";

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const targetUrl = `${Url.BASE}/data/getArboliticsDataset`;

  try {
    // const body = await req.json();
    const body = JSON.stringify({ location_id: 10, limit: 1 });

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
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: body,
    });

    const data = await responseBody.json();
    return NextResponse.json(data, { status: statusCode });
  } catch (error) {
    // TODO create or use logger instead of console.error
    console.error("Proxy error:", error);
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
