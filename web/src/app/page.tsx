import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  Package,
  Search,
  ShoppingBasket,
  Store,
  Truck,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DEMO_PRODUCTS,
  DEMO_STORES,
  EGUSI_SOUP_BUNDLE,
} from "@/lib/mock-data";
import { REGION_LABELS } from "@/lib/types";
import { formatCents } from "@/lib/utils";

/** AfroConnect-inspired department chips for Teedeux */
const DEPARTMENTS = [
  "Fresh Produce",
  "Grains & Flours",
  "Spices",
  "Oils",
  "Meat & Seafood",
  "Swallows & Fufu",
  "Snacks",
  "Frozen",
];

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <AppHeader />

      {/* AfroConnect-style delivery strip */}
      <div className="border-b border-primary/20 bg-primary text-on-primary">
        <div className="mx-auto flex max-w-container-max flex-wrap items-center justify-between gap-3 px-margin-mobile py-3 md:px-margin-desktop">
          <div className="flex min-w-0 items-center gap-2">
            <Clock className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold">Delivery in ~45 minutes</p>
              <p className="truncate text-xs text-on-primary/80">
                <MapPin className="mr-1 inline h-3 w-3" />
                Atlanta · Local African markets nearby
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                size="sm"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="sm" className="bg-white text-primary hover:bg-primary-fixed">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(28,27,27,0.78) 0%, rgba(28,27,27,0.45) 45%, rgba(156,63,0,0.25) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80')",
            }}
          />
          <div className="relative mx-auto flex min-h-[70vh] max-w-container-max flex-col justify-end px-margin-mobile pb-14 pt-24 md:px-margin-desktop md:pb-16">
            <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Teedeux
            </p>
            <h1
              className="mt-3 max-w-xl animate-fade-up font-display text-2xl font-semibold text-white/95 md:text-3xl"
              style={{ animationDelay: "80ms" }}
            >
              African groceries — same-day local, ships nationwide.
            </h1>
            <p
              className="mt-3 max-w-md animate-fade-up text-base text-white/80 md:text-lg"
              style={{ animationDelay: "140ms" }}
            >
              Marketplace energy like AfroConnect, built for US dual fulfillment:
              fresh from neighborhood stores, dry goods across state lines.
            </p>
            <form
              action="/checkout"
              className="mt-6 flex w-full max-w-lg animate-fade-up overflow-hidden rounded-xl bg-white shadow-warm-lg"
              style={{ animationDelay: "180ms" }}
            >
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 text-on-surface-variant" />
                <input
                  name="q"
                  placeholder="Search egusi, plantain, suya spice…"
                  className="w-full border-0 bg-transparent py-3 text-on-surface outline-none placeholder:text-on-surface-variant"
                />
              </div>
              <Link href="/checkout" className="shrink-0">
                <span className="flex h-full items-center bg-primary px-5 font-semibold text-on-primary">
                  Search
                </span>
              </Link>
            </form>
            <div
              className="mt-6 flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "220ms" }}
            >
              <Link href="/checkout">
                <Button size="lg" className="bg-primary-container">
                  Hybrid checkout demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vendor/orders">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  Vendor portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Departments — AfroConnect style */}
        <section className="border-b border-outline-variant/30 bg-savanna-sand/40 py-8">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="mb-4 flex items-center gap-2">
              <ShoppingBasket className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">All departments</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {DEPARTMENTS.map((d) => (
                <span
                  key={d}
                  className="shrink-0 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow-warm"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-14 md:px-margin-desktop">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Dual fulfillment
          </h2>
          <p className="mt-2 max-w-xl text-on-surface-variant">
            One cart, two lanes — perishables stay local; dry specialty goods
            ship cross-state.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary/5 p-6 animate-fade-up">
              <Truck className="h-8 w-8 text-secondary" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                Local same-day
              </h3>
              <p className="mt-2 text-on-surface-variant">
                Shoppers pick from African stores within 10–15 miles. Ideal for
                plantains, scotch bonnets, cassava leaves, and fresh meats.
              </p>
            </div>
            <div
              className="rounded-2xl bg-primary/5 p-6 animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              <Package className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                Nationwide shipping
              </h3>
              <p className="mt-2 text-on-surface-variant">
                Partner vendors print labels for egusi, dried fish, yam flour,
                and spices — 2–4 day delivery.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-outline-variant/30 bg-savanna-sand/50 py-14">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">
                Smart dish search
              </h2>
            </div>
            <p className="mt-2 text-on-surface-variant">
              Search “{EGUSI_SOUP_BUNDLE.name}” and add the full ingredient set.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="primary">{EGUSI_SOUP_BUNDLE.name}</Badge>
              {EGUSI_SOUP_BUNDLE.ingredients.map((ing) => (
                <Badge key={ing} tone="muted">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-14 md:px-margin-desktop">
          <div className="mb-2 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">
                Stores near you
              </h2>
            </div>
            <p className="font-mono text-label-sm text-on-surface-variant">
              We have <span className="text-primary">{DEMO_STORES.length}</span>{" "}
              vendors live
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {DEMO_STORES.map((store) => (
              <article
                key={store.id}
                className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-warm"
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 via-savanna-sand to-secondary/15" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold">
                      {store.name}
                    </h3>
                    <Badge
                      tone={
                        store.fulfillmentType === "SHIPPING_ONLY"
                          ? "primary"
                          : "secondary"
                      }
                    >
                      {store.fulfillmentType.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {store.description}
                  </p>
                  <p className="mt-3 font-mono text-label-sm text-on-surface-variant">
                    {store.address.city}, {store.address.state}
                    {store.localRadiusMiles > 0
                      ? ` · ${store.localRadiusMiles} mi radius`
                      : " · ships only"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {store.regionFocus.map((r) => (
                      <Badge key={r} tone="muted">
                        {REGION_LABELS[r]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <h3 className="mt-12 font-display text-xl font-semibold">
            Featured products
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {DEMO_PRODUCTS.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4"
              >
                <Badge
                  tone={p.temperatureClass === "DRY" ? "primary" : "secondary"}
                >
                  {p.temperatureClass}
                </Badge>
                <p className="mt-3 font-semibold leading-snug">{p.name}</p>
                <p className="mt-1 font-mono text-label-sm text-on-surface-variant">
                  {p.storeName}
                </p>
                <p className="mt-2 font-display font-bold text-primary">
                  {formatCents(p.priceCents)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/checkout">
              <Button>Open hybrid checkout</Button>
            </Link>
            <Link href="/shopper/order/TDX-10490">
              <Button variant="secondary">Shopper picking UI</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">Admin users (RBAC)</Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-outline-variant/30 py-8 text-center font-mono text-label-sm text-on-surface-variant">
        Teedeux · AfroConnect-inspired marketplace · Local + Nationwide · RBAC
        Admin
      </footer>
    </div>
  );
}
