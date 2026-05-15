import { NextRequest, NextResponse } from "next/server";
import { registerWCCustomer } from "@/lib/woocommerce";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create or find the customer in WooCommerce
    const customer = await registerWCCustomer(email, firstName || "", lastName || "");

    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
      }
    });
  } catch (error: any) {
    console.error("Registration route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register user" },
      { status: 500 }
    );
  }
}
