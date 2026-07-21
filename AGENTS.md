# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout
- `web/` — the actual product: a Next.js (App Router) + TypeScript + Tailwind app. All dev/lint/build/run commands run from `web/`.
- `stitch_teedeux_mart_delivery_app/` — static design mockups only (no build step).

### Services
Single service: the Next.js `web` app. Standard commands are in `web/package.json` and `web/README.md`:
- Dev server: `npm run dev` (from `web/`, serves http://localhost:3000)
- Lint: `npm run lint`
- Build: `npm run build`

### Non-obvious notes
- A `web/.env` is required for `next build`/`prisma.config.ts` to load without error. Copy it from `web/.env.example` (`cp web/.env.example web/.env`). The dependency update script already creates it if missing.
- No database is needed to run or demo the app. All UI pages (`/`, `/checkout`, `/vendor/orders`, `/shopper/order/[id]`) and the mock shipping APIs use in-memory data in `web/src/lib/mock-data.ts` — Prisma/Postgres is scaffolding only (`@prisma/client` is not imported anywhere in `src`). `npm run db:*` targets need a real `DATABASE_URL` and are optional.
- The shipping API expects nested cart items: `POST /api/shipping/rate` needs `{ items: [{ id, quantity, fulfillment, product: {...full Product...} }], toAddress: {...} }`. A flat item shape returns `{"error":"Invalid request"}`.
- There are no automated tests and no git hooks/CI in this repo.
