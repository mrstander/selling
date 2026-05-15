import { NextRequest, NextResponse } from "next/server";
import { searchSuburbs } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const maxResults = parseInt(searchParams.get("limit") ?? "10", 10);

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const results = await searchSuburbs(query.trim(), maxResults);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Suburb search failed:", error);

    const message =
      error instanceof Error ? error.message : "Search failed";

    const isAuthError = message.includes("401") || message.includes("403");

    return NextResponse.json(
      {
        error: isAuthError
          ? "API authentication failed. Check your subscription key."
          : message,
      },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
