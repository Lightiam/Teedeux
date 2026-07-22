# Teedeux Web

Next.js (App Router) frontend and schema for **Teedeux** — a dual-fulfillment African grocery platform for the US market:

1. **Local same-day delivery** — perishables from neighborhood stores (Instacart-style shoppers)
2. **Nationwide shipping** — dry specialty goods via carrier labels (Shippo / EasyPost)

Design tokens follow the **Teedeux Vitality** system in `/stitch_teedeux_mart_delivery_app/teedeux_vitality/DESIGN.md`.

## Stack

- Next.js App Router · TypeScript · Tailwind CSS
- Lucide icons · CVA / shadcn-style primitives
- Prisma ORM · PostgreSQL
- Mock shipping rate/label APIs (ready for Shippo/EasyPost)
- Stripe Connect hooks planned for split payouts

## Key routes

| Route | Role |
|-------|------|
| `/` | Marketing home + store/product preview |
| `/checkout` | Hybrid cart: Local Same-Day vs Nationwide Shipped |
| `/vendor/orders` | Vendor fulfillment + Print Shipping Label + inventory editor |
| `/shopper/order/[id]` | In-store picking checklist + substitution flow |
| `POST /api/shipping/rate` | Mock carrier rate shopping |
| `POST /api/shipping/label` | Mock label purchase |

## Getting started

```bash
cd web
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database (optional for UI demo)

UI pages use in-memory mock data. To wire Prisma:

```bash
# Set DATABASE_URL in .env
npm run db:generate
npm run db:push
```

Schema: `prisma/schema.prisma` — `User`, `Store`, `Product`, `Order`, `OrderItem`, `Delivery`, `SubstitutionRequest`, `RecipeBundle`.

## Dual-fulfillment model

```
Customer cart
├── LOCAL_DELIVERY  → shopper pick + same-day dropoff
└── NATIONWIDE_SHIPPING → vendor prints label → USPS/UPS/FedEx
```

Products use `temperatureClass` (`FRESH` | `FROZEN` | `DRY`) plus `shippable` / `localAvailable` flags to route items automatically.
