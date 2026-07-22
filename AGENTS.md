# AGENTS.md

## Cursor Cloud specific instructions

### Product context
Teedeux is a **mobile app** (mobile-first grocery delivery for African specialty foods). The product is designed as native-feeling phone screens; there is **no native mobile toolchain in this repo** (no React Native / Flutter / Swift / Kotlin). The mobile app exists here in two forms:
- `web/` — the coded, runnable implementation: a Next.js (App Router) + TypeScript + Tailwind app. It is mobile-first/responsive; view it in a phone-sized viewport (~390px) to see the intended mobile UX. All dev/lint/build/run commands run from `web/`.
- `stitch_teedeux_mart_delivery_app/` — static HTML mockups of the mobile app screens (splash, onboarding, login, homepage, cart, checkout, live tracking, profile, admin). Each screen is a self-contained `code.html` (Tailwind via CDN) with a matching `screen.png`. No build step.

### Services
- Coded app — the Next.js `web` app. Standard commands are in `web/package.json` and `web/README.md`:
  - Dev server: `npm run dev` (from `web/`, serves http://localhost:3000)
  - Lint: `npm run lint`
  - Build: `npm run build`
- Mobile mockups — static files needing no dependencies. Serve them for viewing with any static server from the repo root, e.g. `python3 -m http.server 8080`, then open `http://localhost:8080/stitch_teedeux_mart_delivery_app/<screen>/code.html`. Opening the `code.html` files directly in a browser also works.

### Non-obvious notes
- A `web/.env` is required for `next build`/`prisma.config.ts` to load without error. Copy it from `web/.env.example` (`cp web/.env.example web/.env`). The dependency update script already creates it if missing.
- No database is needed to run or demo the app. All UI pages (`/`, `/checkout`, `/vendor/orders`, `/shopper/order/[id]`) and the mock shipping APIs use in-memory data in `web/src/lib/mock-data.ts` — Prisma/Postgres is scaffolding only (`@prisma/client` is not imported anywhere in `src`). `npm run db:*` targets need a real `DATABASE_URL` and are optional.
- The shipping API expects nested cart items: `POST /api/shipping/rate` needs `{ items: [{ id, quantity, fulfillment, product: {...full Product...} }], toAddress: {...} }`. A flat item shape returns `{"error":"Invalid request"}`.
- There are no automated tests and no git hooks/CI in this repo.
