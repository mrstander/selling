const fs = require('fs');
const path = require('path');

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

async function testFetch(email) {
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
  
  // Try by customer ID first
  console.log(`Checking for customer: ${email}`);
  const cRes = await fetch(`${WC_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`, {
    headers: { "Authorization": `Basic ${auth}` }
  });
  const customers = await cRes.json();
  const customer = customers[0];
  
  if (customer) {
    console.log(`Customer ID: ${customer.id}`);
    const oRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders?customer=${customer.id}`, {
      headers: { "Authorization": `Basic ${auth}` }
    });
    const orders = await oRes.json();
    console.log(`Orders found by customer ID: ${orders.length}`);
  } else {
    console.log("No customer found for this email.");
  }

  // Try by search (email)
  const sRes = await fetch(`${WC_URL}/wp-json/wc/v3/orders?search=${encodeURIComponent(email)}`, {
    headers: { "Authorization": `Basic ${auth}` }
  });
  const sOrders = await sRes.json();
  console.log(`Orders found by search (email): ${sOrders.length}`);
}

testFetch('gavinstander@mweb.co.za');
