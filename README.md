# Teedeux

**African groceries in the US — local same-day delivery + nationwide shipping.**

## Apps

| Path | What |
|------|------|
| [`mobile/`](./mobile) | **Production Expo app (iOS / Android / Web)** — full customer + shopper flows |
| [`web/`](./web) | Next.js vendor portal, hybrid checkout reference, Prisma schema |
| [`stitch_teedeux_mart_delivery_app/`](./stitch_teedeux_mart_delivery_app) | Stitch UI mockups + Teedeux Vitality design system |

## Mobile (primary)

```bash
cd mobile
npm install
npx expo start
```

Demo logins: `ada@teedeux.com` (customer) or `shopper@teedeux.com` (shopper) — any password 4+ characters.

See [`mobile/README.md`](./mobile/README.md) for EAS production builds and the full route map.

## Dual fulfillment

```
Customer cart
├── LOCAL_DELIVERY     → shopper pick + same-day dropoff
└── NATIONWIDE_SHIPPING → vendor label → USPS / UPS / FedEx
```
