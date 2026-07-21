# Teedeux

**African groceries in the US — local same-day delivery + nationwide shipping.**

Teedeux is a hybrid grocery platform tailored for African specialty foods:

- **Local hyperlocal delivery** for fresh produce and meats (plantains, scotch bonnets, cassava leaves)
- **Nationwide shipping** for dry specialty ingredients (egusi, stockfish, yam flour, spices)

## Repository layout

| Path | Contents |
|------|----------|
| [`web/`](./web) | Next.js app — schema, checkout, vendor portal, shopper picking UI |
| [`stitch_teedeux_mart_delivery_app/`](./stitch_teedeux_mart_delivery_app) | Stitch UI mockups + Teedeux Vitality design system |

## Quick start

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Demo surfaces:

- Customer hybrid checkout → `/checkout`
- Vendor shipping & fulfillment → `/vendor/orders`
- Shopper in-store picking → `/shopper/order/TDX-10490`

See [`web/README.md`](./web/README.md) for architecture details.

## Product phases

**Phase 1 (MVP scaffold in this repo)**  
Local store listing mindset, inventory model, customer + vendor + shopper UIs, mock third-party delivery / shipping APIs.

**Phase 2**  
Live Shippo/EasyPost labels, weighted items, dish-to-ingredient bundles, Stripe Connect payouts.
