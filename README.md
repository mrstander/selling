# PropValue — Lightstone Property Valuation Tool

A production-ready property valuation platform built with Next.js, integrated with the [Lightstone API](https://portal.apis.lightstone.co.za) and [WooCommerce](https://woocommerce.com).

## Key Features

- **Advanced Property Search**: Deep integration with Lightstone API for suburb, town, and address-based property discovery.
- **E-commerce Integration**: Live WooCommerce API synchronization for managing report purchases and subscriptions.
- **Credit-Based Access**: Secure reporting system where report unlocks are gated by active customer orders.
- **Dynamic Dashboard**: User account dashboard for tracking order history, available credits, and unlocked reports.
- **Professional Valuations**: Interactive property valuation cards with market trends and statistics.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the environment template and add your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```bash
# Lightstone API
LIGHTSTONE_SUBSCRIPTION_KEY=your-key
LIGHTSTONE_API_BASE_URL=https://apis.lightstone.co.za

# WooCommerce API
WC_URL=https://your-wordpress-site.com
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── orders/             # WooCommerce order synchronization
│   │   ├── property-report/    # Credit-gated report generation
│   │   └── ...                 # Lightstone proxy routes
│   ├── account/                # User dashboard & credits
│   ├── checkout/               # WooCommerce checkout flow
│   ├── pricing/                # Plan selection & product mapping
│   └── search/                 # Advanced property discovery
├── components/
│   ├── PropertyResultsTable.tsx # Credit-aware results display
│   ├── PropertyReportView.tsx   # Detailed report visualizations
│   └── ...
├── lib/
│   ├── woocommerce.ts          # Server-side WooCommerce client
│   ├── lightstone-client.ts    # Lightstone API client
│   └── utils.ts                # UI & formatting helpers
```

## Architecture

- **Secure Proxying**: All third-party API keys (Lightstone & WooCommerce) are stored server-side and never exposed to the client.
- **Credit Enforcement**: Report access is validated server-side by checking the user's order history via WooCommerce.
- **Atomic Components**: Modular UI built with Tailwind CSS for high performance and responsiveness.
