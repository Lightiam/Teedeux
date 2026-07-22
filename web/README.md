# Teedeux Web

Next.js app for **Teedeux** — African grocery marketplace (AfroConnect-inspired UX) with dual fulfillment and **RBAC admin**.

## Stack

- Next.js App Router · TypeScript · Tailwind · Lucide
- Prisma ORM · PostgreSQL (optional — in-memory demo without `DATABASE_URL`)
- Auth: bcryptjs + jose JWT cookies
- Roles: `SUPER_ADMIN` · `ADMIN` · `VENDOR` · `SHOPPER` · `CUSTOMER`

## Super Admin

Seed / memory bootstrap always elevates:

- Email: `teedeux.dev@gmail.com`
- Password: `ChangeMeImmediately123!`

Root Super Admin cannot be deleted or downgraded.

## Run

```bash
cd web
cp .env.example .env   # optional DATABASE_URL
npm install
npm run db:generate
npm run dev
```

With Postgres:

```bash
npm run db:push
npm run db:seed
```

## Admin

| Route | Purpose |
|-------|---------|
| `/login` | Sign in |
| `/admin` | Command center |
| `/admin/users` | User table, add user, edit role, suspend |
| `GET/POST /api/admin/users` | List / create |
| `PATCH /api/admin/users/[id]/role` | Update role |
| `DELETE /api/admin/users/[id]` | Soft-deactivate + audit log |

## Marketplace demos

| Route | Purpose |
|-------|---------|
| `/` | AfroConnect-style storefront home |
| `/checkout` | Hybrid cart checkout |
| `/vendor/orders` | Vendor fulfillment |
| `/shopper/order/[id]` | Shopper picking |

## Prisma schema

See `prisma/schema.prisma` — User RBAC, Store (`HYBRID`), Product, Order (local vs nationwide), AuditLog.
