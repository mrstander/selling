/**
 * WooCommerce API Client
 */

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

/**
 * Helper to make authenticated requests to WooCommerce
 */
export async function wcRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    throw new Error("WooCommerce credentials not configured");
  }

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
  
  const url = `${WC_URL}/wp-json/wc/v3${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `WooCommerce API Error: ${response.status}`);
  }

  return data as T;
}

/**
 * Register a new customer in WooCommerce
 */
export async function registerWCCustomer(email: string, firstName: string, lastName: string) {
  try {
    // Check if customer exists first
    const existing = await wcRequest<any[]>(`/customers?email=${encodeURIComponent(email)}`);
    
    if (existing && existing.length > 0) {
      return existing[0];
    }

    // Create new customer
    const newCustomer = await wcRequest<any>("/customers", {
      method: "POST",
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000), // Randomize username if needed
      }),
    });

    return newCustomer;
  } catch (error) {
    console.error("WooCommerce registration failed:", error);
    throw error;
  }
}

/**
 * Get customer details by email
 */
export async function getWCCustomer(email: string) {
  const customers = await wcRequest<any[]>(`/customers?email=${encodeURIComponent(email)}`);
  return customers && customers.length > 0 ? customers[0] : null;
}

/**
 * Update customer details in WooCommerce
 */
export async function updateWCCustomer(customerId: number, data: { first_name?: string; last_name?: string }) {
  return wcRequest<any>(`/customers/${customerId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Create a new order in WooCommerce
 */
export async function createWCOrder(customerId: number, planName: string, total: number, productId: number, billing: any) {
  return wcRequest<any>("/orders", {
    method: "POST",
    body: JSON.stringify({
      customer_id: customerId,
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer (Simulated)",
      set_paid: true,
      line_items: [
        {
          product_id: productId,
          quantity: 1,
          total: total.toString(),
        }
      ],
      billing: {
        first_name: billing?.fullName?.split(" ")[0] || "",
        last_name: billing?.fullName?.split(" ").slice(1).join(" ") || "",
        address_1: billing?.address || "",
        city: billing?.city || "",
        postcode: billing?.postalCode || "",
        email: billing?.email || ""
      }
    }),
  });
}

/**
 * Get all orders for a specific customer email
 */
export async function getWCCustomerOrders(email: string) {
  try {
    const customer = await getWCCustomer(email);
    if (!customer) return [];
    
    return wcRequest<any[]>(`/orders?customer=${customer.id}`);
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return [];
  }
}
