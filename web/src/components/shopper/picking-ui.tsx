"use client";

import { useMemo, useState } from "react";
import {
  Check,
  MapPin,
  Navigation,
  PackageX,
  RefreshCw,
  Ban,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderItemStatus, OrderItemView, ShopperOrder } from "@/lib/types";
import { cn, formatAddress, formatCents } from "@/lib/utils";

const SUBSTITUTION_CATALOG: Record<string, { name: string; priceCents: number }[]> = {
  prod_plantain: [
    { name: "Green Plantains", priceCents: 129 },
    { name: "Sweet Plantains (pre-ripe pack)", priceCents: 179 },
  ],
  prod_scotch: [
    { name: "Habanero Peppers", priceCents: 349 },
    { name: "Dried Scotch Bonnet", priceCents: 499 },
  ],
  prod_goat: [
    { name: "Lamb Stew Meat", priceCents: 949 },
    { name: "Beef Stew Cubes", priceCents: 799 },
  ],
  prod_bitter_leaf: [
    { name: "Frozen Bitter Leaf", priceCents: 399 },
    { name: "Spinach (soup greens)", priceCents: 299 },
  ],
  prod_palm_oil: [
    { name: "Zomi Palm Oil 750ml", priceCents: 999 },
    { name: "Palm Cream (alternative)", priceCents: 849 },
  ],
};

interface PickingUIProps {
  order: ShopperOrder;
}

export function PickingUI({ order }: PickingUIProps) {
  const [items, setItems] = useState<OrderItemView[]>(order.items);
  const [activeReplaceId, setActiveReplaceId] = useState<string | null>(null);
  const [customSub, setCustomSub] = useState("");
  const [done, setDone] = useState(false);

  const progress = useMemo(() => {
    const resolved = items.filter((i) =>
      ["FOUND", "SUBSTITUTED", "REFUNDED", "UNAVAILABLE"].includes(i.status)
    ).length;
    return { resolved, total: items.length };
  }, [items]);

  const allResolved = progress.resolved === progress.total;

  function setStatus(id: string, status: OrderItemStatus, note?: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, substitutionNote: note ?? item.substitutionNote }
          : item
      )
    );
    setActiveReplaceId(null);
    setCustomSub("");
  }

  function suggestSub(item: OrderItemView, name: string, priceCents: number) {
    setStatus(
      item.id,
      "SUBSTITUTION_PENDING",
      `Suggested: ${name} (${formatCents(priceCents)}) — awaiting customer`
    );
    // Demo: auto-approve after brief delay to show flow
    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                status: "SUBSTITUTED",
                substitutionNote: `Customer approved: ${name}`,
                unitPriceCents: priceCents,
              }
            : row
        )
      );
    }, 900);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-surface-container-lowest p-8 text-center shadow-warm-lg animate-fade-up">
        <Navigation className="mx-auto h-12 w-12 text-secondary" />
        <h2 className="mt-4 font-display text-2xl font-bold">
          Heading to customer
        </h2>
        <p className="mt-2 text-on-surface-variant">
          {formatAddress(order.customerAddress)}
        </p>
        <p className="mt-4 font-mono text-label-md text-secondary">
          Payout {formatCents(order.payoutCents)}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="animate-fade-up rounded-2xl bg-gradient-to-br from-primary/10 via-savanna-sand to-secondary/10 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-label-sm text-on-surface-variant">
              In-store picking
            </p>
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              {order.orderNumber}
            </h1>
            <p className="mt-1 text-on-surface-variant">
              {order.store.name} → {order.customerName}
            </p>
          </div>
          <div className="text-right">
            <Badge tone="secondary">{order.itemCount} items</Badge>
            <p className="mt-2 flex items-center justify-end gap-1 font-display text-lg font-bold text-secondary">
              <DollarSign className="h-4 w-4" />
              {formatCents(order.payoutCents)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between font-mono text-label-sm">
            <span>
              {progress.resolved}/{progress.total} gathered
            </span>
            <span>{Math.round((progress.resolved / progress.total) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-secondary transition-all duration-500"
              style={{
                width: `${(progress.resolved / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
        <p className="mt-3 flex items-start gap-2 text-sm text-on-surface-variant">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {formatAddress(order.customerAddress)}
          {order.deliveryNotes ? ` · ${order.deliveryNotes}` : ""}
        </p>
      </header>

      <ul className="space-y-3">
        {items.map((item, index) => {
          const resolved = [
            "FOUND",
            "SUBSTITUTED",
            "REFUNDED",
            "UNAVAILABLE",
          ].includes(item.status);
          const replacing = activeReplaceId === item.id;
          const suggestions =
            SUBSTITUTION_CATALOG[item.product.id] ?? [
              { name: `Similar to ${item.product.name}`, priceCents: item.unitPriceCents },
            ];

          return (
            <li
              key={item.id}
              className={cn(
                "animate-fade-up rounded-2xl border bg-surface-container-lowest p-4 transition-all",
                resolved
                  ? "border-secondary/30 opacity-80"
                  : "border-outline-variant/40",
                item.status === "SUBSTITUTION_PENDING" && "border-tertiary"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  disabled={resolved}
                  onClick={() => setStatus(item.id, "FOUND")}
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    item.status === "FOUND" || item.status === "SUBSTITUTED"
                      ? "border-secondary bg-secondary text-on-secondary"
                      : "border-outline hover:border-secondary"
                  )}
                  aria-label={`Mark ${item.product.name} found`}
                >
                  {(item.status === "FOUND" ||
                    item.status === "SUBSTITUTED") && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p
                        className={cn(
                          "font-display text-lg font-semibold",
                          resolved && "line-through decoration-2"
                        )}
                      >
                        {item.product.name}
                      </p>
                      <p className="font-mono text-label-sm text-on-surface-variant">
                        qty {item.quantity} {item.product.unit.toLowerCase()} ·{" "}
                        {formatCents(item.unitPriceCents)} · aisle produce /
                        dry
                      </p>
                    </div>
                    <ItemStatusChip status={item.status} />
                  </div>

                  {item.substitutionNote && (
                    <p className="mt-2 rounded-lg bg-tertiary-fixed/50 px-3 py-2 text-sm text-on-tertiary-fixed-variant">
                      {item.substitutionNote}
                    </p>
                  )}

                  {!resolved && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => setStatus(item.id, "FOUND")}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Found
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setActiveReplaceId(replacing ? null : item.id)
                        }
                      >
                        <PackageX className="h-3.5 w-3.5" />
                        Out of stock
                      </Button>
                    </div>
                  )}

                  {replacing && (
                    <div className="mt-4 space-y-3 rounded-xl bg-savanna-sand/90 p-3 animate-fade-up">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        Suggest a replacement
                      </p>
                      <div className="space-y-2">
                        {suggestions.map((s) => (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() =>
                              suggestSub(item, s.name, s.priceCents)
                            }
                            className="flex w-full items-center justify-between rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 text-left text-sm transition-colors hover:border-primary"
                          >
                            <span>{s.name}</span>
                            <span className="font-mono">
                              {formatCents(s.priceCents)}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={customSub}
                          onChange={(e) => setCustomSub(e.target.value)}
                          placeholder="Custom brand / item"
                          className="min-w-0 flex-1 rounded-lg border-0 border-b-2 border-transparent bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={!customSub.trim()}
                          onClick={() =>
                            suggestSub(
                              item,
                              customSub.trim(),
                              item.unitPriceCents
                            )
                          }
                        >
                          Suggest
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-error"
                        onClick={() => setStatus(item.id, "REFUNDED", "Refunded — item unavailable")}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Refund item instead
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-4 animate-fade-up">
        <Button
          className="w-full shadow-warm-lg"
          size="lg"
          disabled={!allResolved}
          onClick={() => setDone(true)}
        >
          <Navigation className="h-4 w-4" />
          {allResolved
            ? "Complete shopping · Start delivery"
            : `Gather remaining ${progress.total - progress.resolved} items`}
        </Button>
      </div>
    </div>
  );
}

function ItemStatusChip({ status }: { status: OrderItemStatus }) {
  if (status === "PENDING") return <Badge tone="muted">To pick</Badge>;
  if (status === "FOUND") return <Badge tone="secondary">Found</Badge>;
  if (status === "SUBSTITUTION_PENDING")
    return <Badge tone="tertiary">Awaiting approval</Badge>;
  if (status === "SUBSTITUTED") return <Badge tone="primary">Substituted</Badge>;
  if (status === "REFUNDED") return <Badge tone="danger">Refunded</Badge>;
  return <Badge tone="danger">Unavailable</Badge>;
}
