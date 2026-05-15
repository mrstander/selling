
import { wcRequest } from "./lib/woocommerce";

async function checkSpecificProducts() {
  try {
    const p124 = await wcRequest<any>("/products/124").catch(() => null);
    const p125 = await wcRequest<any>("/products/125").catch(() => null);
    console.log(`Product 124: ${p124 ? p124.name : "Not Found"}`);
    console.log(`Product 125: ${p125 ? p125.name : "Not Found"}`);
  } catch (error) {
    console.error("Error checking specific products:", error);
  }
}

checkSpecificProducts();
