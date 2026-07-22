# Teedeux

**African groceries in the US — local same-day delivery + nationwide shipping.**

Storefront is a full rebrand of [AfroConnect](https://github.com/Lightiam/AfroConnect) (product catalog, shops, cart, checkout preserved).

## Apps

| Path | What |
|------|------|
| [`html/`](./html) | **Customer storefront** — rebranded AfroConnect (Netlify) |
| [`web/`](./web) | Next.js RBAC admin + hybrid checkout APIs |
| [`mobile/`](./mobile) | Expo React Native app |
| [`stitch_teedeux_mart_delivery_app/`](./stitch_teedeux_mart_delivery_app) | Stitch mockups + Vitality design system |

## Launch storefront

```bash
cd html && python3 -m http.server 8080
# http://localhost:8080
```

### Netlify

Root [`netlify.toml`](./netlify.toml) publishes `html/` with no build step.

1. Netlify → import this repo  
2. Deploy (publish directory = `html`)

Or: `npx netlify-cli deploy --prod --dir=html`

## Admin (web)

```bash
cd web && npm install && npm run dev
# Super Admin: teedeux.dev@gmail.com / ChangeMeImmediately123!
```

## Dual fulfillment

```
Customer cart
├── LOCAL_DELIVERY     → shopper pick + same-day dropoff
└── NATIONWIDE_SHIPPING → vendor label → USPS / UPS / FedEx
```
