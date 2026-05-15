const fs = require('fs');
const path = require('path');

// Basic .env.local parser
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

loadEnv();

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

async function listOrders() {
  if (!WC_URL || !WC_KEY || !WC_SECRET) {
    console.error("Missing credentials in .env.local");
    return;
  }
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
  const url = `${WC_URL}/wp-json/wc/v3/orders?per_page=10`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    const orders = await response.json();
    console.log("Recent Orders:");
    if (Array.isArray(orders)) {
      orders.forEach(o => {
        console.log(`Order #${o.id} - ${o.status} - ${o.billing.email} - ${o.total}`);
      });
    } else {
      console.log("Response:", orders);
    }
  } catch (e) {
    console.error(e);
  }
}

listOrders();
