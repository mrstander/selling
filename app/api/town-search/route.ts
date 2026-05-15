import { NextRequest, NextResponse } from "next/server";
import { searchTowns } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = searchParams.get("limit");

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const maxResults = limit ? parseInt(limit, 10) : 10;
    const results = await searchTowns(query.trim(), maxResults);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Town search API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
