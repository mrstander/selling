import { NextRequest, NextResponse } from "next/server";
import { getWCCustomer, updateWCCustomer } from "@/lib/woocommerce";

export async function PUT(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const customer = await getWCCustomer(email);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const updatedCustomer = await updateWCCustomer(customer.id, {
      first_name: firstName,
      last_name: lastName
    });

    return NextResponse.json({ 
      success: true, 
      customer: {
        id: updatedCustomer.id,
        firstName: updatedCustomer.first_name,
        lastName: updatedCustomer.last_name
      } 
    });
  } catch (error: any) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
