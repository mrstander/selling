import { NextRequest, NextResponse } from "next/server";
import { createWCOrder, getWCCustomerOrders, getWCCustomer, registerWCCustomer } from "@/lib/woocommerce";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const orders = await getWCCustomerOrders(email);
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, planName, total, wcProductId, billing } = await request.json();

    if (!email || !planName) {
      return NextResponse.json({ error: "Email and plan name are required" }, { status: 400 });
    }

    console.log("Attempting to create WooCommerce order:", { email, planName, total, wcProductId });

    let customer = await getWCCustomer(email);
    
    if (!customer) {
      console.log("Customer not found in WooCommerce, attempting to create:", email);
      // Try to register the customer on the fly
      try {
        const firstName = billing?.fullName?.split(" ")[0] || email.split("@")[0];
        const lastName = billing?.fullName?.split(" ").slice(1).join(" ") || "";
        customer = await registerWCCustomer(email, firstName, lastName);
        console.log("Customer created successfully on the fly:", customer.id);
      } catch (regError: any) {
        console.error("Failed to create customer on the fly:", regError);
        return NextResponse.json({ error: "Customer not found and could not be created" }, { status: 404 });
      }
    }

    console.log("Found or created WooCommerce customer:", customer.id);

    const order = await createWCOrder(customer.id, planName, total, wcProductId, billing);
    console.log("WooCommerce order created successfully:", order.id);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order creation error:", {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
