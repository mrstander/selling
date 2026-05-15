import { NextRequest, NextResponse } from "next/server";
import { getPropertySellersReport, getPropertyReport } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("id");
  const type = searchParams.get("type") || "sellers";

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property ID is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching ${type} Report for ID: ${propertyId}`);
    const data = type === "property" 
      ? await getPropertyReport(propertyId)
      : await getPropertySellersReport(propertyId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch Sellers Report:", {
      propertyId,
      error: error instanceof Error ? error.message : error,
    });

    const message =
      error instanceof Error ? error.message : "Failed to fetch report data";

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
