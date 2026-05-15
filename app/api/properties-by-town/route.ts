import { NextRequest, NextResponse } from "next/server";
import { searchPropertiesByTown } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const townId = searchParams.get("townId");
  const limit = searchParams.get("limit");

  if (!townId) {
    return NextResponse.json({ error: "townId is required" }, { status: 400 });
  }

  try {
    const maxResults = limit ? parseInt(limit, 10) : 50;
    const results = await searchPropertiesByTown(parseInt(townId, 10), maxResults);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Properties by town search failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch properties for this town" },
      { status: 500 }
    );
  }
}
