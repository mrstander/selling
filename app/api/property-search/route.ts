import { NextRequest, NextResponse } from "next/server";
import { searchComplete } from "@/lib/lightstone-client";

export const dynamic = 'force-dynamic';

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
    const results = await searchComplete(query.trim(), maxResults);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Property search failed:", error);

    const message =
      error instanceof Error ? error.message : "Search failed";

    // Don't leak internal API details to the client
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
