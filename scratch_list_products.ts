
import { wcRequest } from "./lib/woocommerce";

async function listProducts() {
  try {
    const products = await wcRequest<any[]>("/products?status=any&per_page=100");
    console.log("Available Products (All Statuses):");
    products.forEach(p => {
      console.log(`ID: ${p.id} | Name: ${p.name} | Status: ${p.status}`);
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}

listProducts();
