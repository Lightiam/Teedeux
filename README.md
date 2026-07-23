# Teedeux

**African groceries in the US — local same-day delivery + nationwide shipping.**

## Apps

| Path | What |
|------|------|
| [`html/`](./html) | **HTML5 PWA** — mobile + desktop (Netlify) |
| [`web/`](./web) | Next.js marketplace + **RBAC admin** (AfroConnect-inspired) |
| [`mobile/`](./mobile) | Expo React Native app |
| [`stitch_teedeux_mart_delivery_app/`](./stitch_teedeux_mart_delivery_app) | Stitch mockups + Vitality design system |

### Admin (web)

```bash
cd web && npm install && npm run dev
# http://localhost:3000/login → /admin/products
```

Super Admin: `teedeux.dev@gmail.com` / `ChangeMeImmediately123!`

### Super Admin products (live Netlify shop)

Owner product editor on the static site:

- **Link:** `/admin.html` (also from Profile → Super Admin · Products, Monitor, or the orange **Admin** chip)
- Same Super Admin credentials as above
- Create / edit / delete products; export & import JSON; reset to defaults
- Updates apply immediately to the shop catalog in that browser

Next.js mirror: `/admin/products` (session-gated RBAC API at `/api/admin/products`).

## HTML5 (fastest to open)

```bash
cd html && python3 -m http.server 8080
# http://localhost:8080
```

### Deploy on Netlify

Repo root [`netlify.toml`](./netlify.toml) publishes the `html/` folder with no build step.

1. Netlify → **Add new site** → import this GitHub repo  
2. Settings are auto-detected (`publish = html`)  
3. Deploy  

Or: `npx netlify-cli deploy --prod --dir=html`

See [`html/README.md`](./html/README.md) for details.

## Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Demo logins: `ada@teedeux.com` (customer) or `shopper@teedeux.com` (shopper) — any password 4+ characters.

See [`html/README.md`](./html/README.md) and [`mobile/README.md`](./mobile/README.md).

## Dual fulfillment

```
Customer cart
├── LOCAL_DELIVERY     → shopper pick + same-day dropoff
└── NATIONWIDE_SHIPPING → vendor label → USPS / UPS / FedEx
```
