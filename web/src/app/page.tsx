import Link from "next/link";
import {
  ArrowRight,
  Package,
  Search,
  Store,
  Truck,
  UtensilsCrossed,
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

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(28,27,27,0.78) 0%, rgba(28,27,27,0.45) 45%, rgba(156,63,0,0.25) 100%), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80')",
            }}
          />
          <div className="relative mx-auto flex min-h-[78vh] max-w-container-max flex-col justify-end px-margin-mobile pb-16 pt-28 md:px-margin-desktop md:pb-20">
            <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Teedeux
            </p>
            <h1 className="mt-3 max-w-xl animate-fade-up font-display text-2xl font-semibold text-white/95 md:text-3xl" style={{ animationDelay: "80ms" }}>
              African groceries — same-day local, ships nationwide.
            </h1>
            <p className="mt-3 max-w-md animate-fade-up text-base text-white/80 md:text-lg" style={{ animationDelay: "140ms" }}>
              Fresh plantains from neighborhood markets. Egusi and stockfish from
              specialty vendors across the US.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Link href="/checkout">
                <Button size="lg" className="bg-primary-container">
                  Hybrid checkout demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vendor/orders">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                  Vendor portal
                </Button>
              </Link>
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
            <div className="rounded-2xl bg-primary/5 p-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <Package className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                Nationwide shipping
              </h3>
              <p className="mt-2 text-on-surface-variant">
                Partner vendors print labels via Shippo/EasyPost for egusi, dried
                fish, yam flour, and spices — 2–4 day delivery.
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
              <Badge tone="primary">
                <UtensilsCrossed className="mr-1 inline h-3 w-3" />
                {EGUSI_SOUP_BUNDLE.name}
              </Badge>
              {EGUSI_SOUP_BUNDLE.ingredients.map((ing) => (
                <Badge key={ing} tone="muted">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-container-max px-margin-mobile py-14 md:px-margin-desktop">
          <div className="mb-6 flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Nearby & ship-from</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {DEMO_STORES.map((store) => (
              <article
                key={store.id}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5"
              >
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
            <Link href="/vendor/orders">
              <Button variant="outline">Vendor orders</Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-outline-variant/30 py-8 text-center font-mono text-label-sm text-on-surface-variant">
        Teedeux · Dual-fulfillment African grocery platform · Phase 1 MVP scaffold
      </footer>
    </div>
  );
}
