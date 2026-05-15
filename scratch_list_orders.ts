
import { wcRequest } from "./lib/woocommerce";

async function listOrders() {
  try {
    const orders = await wcRequest<any[]>("/orders?per_page=10");
    console.log("Recent Orders:");
    orders.forEach(o => {
      console.log(`ID: ${o.id} | Status: ${o.status} | Total: ${o.total} | Customer: ${o.billing.email}`);
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }
}

listOrders();
