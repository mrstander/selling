import { NextRequest, NextResponse } from "next/server";
import { searchPropertiesBySuburb } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const suburbId = searchParams.get("suburbId");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!suburbId) {
    return NextResponse.json(
      { error: "suburbId is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchPropertiesBySuburb(parseInt(suburbId, 10), limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Properties by suburb search failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch properties for this suburb" },
      { status: 500 }
    );
  }
}
