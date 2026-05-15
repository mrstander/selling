import { NextRequest, NextResponse } from "next/server";
import { getPropertyAddressDetail, getAddressDetail } from "@/lib/lightstone-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const propertyId = searchParams.get("propertyId");

  try {
    if (propertyId) {
      const details = await getPropertyAddressDetail(propertyId);
      return NextResponse.json(details);
    } else if (id) {
      const details = await getAddressDetail(id);
      return NextResponse.json(details);
    } else {
      return NextResponse.json(
        { error: "Either 'id' or 'propertyId' is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Address lookup failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch address details" },
      { status: 500 }
    );
  }
}
