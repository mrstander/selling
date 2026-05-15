import { NextRequest, NextResponse } from "next/server";
import { getPropertyDetails } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("id");

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property ID is required" },
      { status: 400 }
    );
  }

  try {
    const details = await getPropertyDetails(propertyId);
    return NextResponse.json(details);
  } catch (error) {
    console.error("Property details fetch failed:", error);

    const message =
      error instanceof Error ? error.message : "Fetch failed";

    const isAuthError = message.includes("401") || message.includes("403");
    const isNotFound = message.includes("404");

    return NextResponse.json(
      {
        error: isNotFound
          ? "Property not found."
          : isAuthError
          ? "API authentication failed. Check your subscription key."
          : "Unable to fetch property details. Please try again.",
      },
      { status: isNotFound ? 404 : isAuthError ? 401 : 500 }
    );
  }
}
