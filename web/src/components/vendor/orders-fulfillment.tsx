"use client";

import { useMemo, useState } from "react";
import {
  Printer,
  Package,
  Truck,
  Pencil,
  Thermometer,
  Scale,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product, VendorOrder } from "@/lib/types";
import { REGION_LABELS, TEMP_LABELS } from "@/lib/types";
import { formatAddress, formatCents } from "@/lib/utils";
import { estimateShippingRates, mockCreateShippingLabel } from "@/lib/shipping";

interface VendorOrdersFulfillmentProps {
  initialOrders: VendorOrder[];
  inventory: Product[];
}

export function VendorOrdersFulfillment({
  initialOrders,
  inventory,
}: VendorOrdersFulfillmentProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState<"orders" | "inventory">("orders");
  const [printingId, setPrintingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [products, setProducts] = useState(inventory);

  const shippedPending = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.orderType === "NATIONWIDE_SHIPPING" &&
          ["CONFIRMED", "PENDING", "LABEL_CREATED"].includes(o.status)
      ),
    [orders]
  );

  async function handlePrintLabel(order: VendorOrder) {
    setPrintingId(order.id);
    try {
      const cartLike = order.items.map((item, i) => ({
        id: `v_${i}`,
        product: item.product,
        quantity: item.quantity,
        fulfillment: "NATIONWIDE_SHIPPING" as const,
      }));
      const rates = estimateShippingRates(cartLike, order.shippingAddress);
      const best = rates[0];
      const res = await fetch("/api/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          rateId: best.rateId,
          carrier: best.carrier,
        }),
      });
      const data = res.ok
        ? await res.json()
        : mockCreateShippingLabel({
            orderNumber: order.orderNumber,
            rateId: best.rateId,
            carrier: best.carrier,
          });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? {
                ...o,
                status: "LABEL_CREATED",
                trackingNumber: data.trackingNumber,
                shippingLabelUrl: data.labelUrl,
                shippingCarrier: data.carrier,
                shippingFeeCents: best.amountCents,
              }
            : o
        )
      );
    } finally {
      setPrintingId(null);
    }
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface">
            Shipping & Fulfillment
          </h1>
          <p className="mt-1 text-on-surface-variant">
            Incoming orders, label generation, and inventory constraints.
          </p>
        </div>
        <div className="flex rounded-xl bg-surface-container p-1">
          {(
            [
              ["orders", "Orders"],
              ["inventory", "Inventory"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={
                tab === key
                  ? "rounded-lg bg-surface-container-lowest px-4 py-2 text-sm font-semibold shadow-warm"
                  : "px-4 py-2 text-sm font-medium text-on-surface-variant"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "orders" ? (
        <div className="space-y-4">
          <div className="flex gap-3 font-mono text-label-sm text-on-surface-variant">
            <span>{orders.length} total</span>
            <span>·</span>
            <span>{shippedPending.length} need labels</span>
          </div>

          {orders.map((order, index) => (
            <article
              key={order.id}
              className="animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-semibold">
                      {order.orderNumber}
                    </h2>
                    <OrderTypeBadge type={order.orderType} />
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {order.customerName} ·{" "}
                    <span className="font-mono">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
                <p className="font-display text-xl font-bold text-primary">
                  {formatCents(order.totalCents)}
                </p>
              </div>

              <ul className="mt-4 space-y-2 border-t border-outline-variant/30 pt-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-2 text-sm"
                  >
                    <span>
                      {item.quantity}× {item.product.name}
                      <span className="ml-2 font-mono text-label-sm text-on-surface-variant">
                        {item.product.weightOz
                          ? `${item.product.weightOz} oz`
                          : item.product.unit}
                        {" · "}
                        {TEMP_LABELS[item.product.temperatureClass]}
                      </span>
                    </span>
                    <span className="font-mono">
                      {formatCents(item.unitPriceCents * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-sm text-on-surface-variant">
                Ship to {formatAddress(order.shippingAddress)}
              </p>

              {order.orderType === "NATIONWIDE_SHIPPING" && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {order.trackingNumber ? (
                    <div className="flex items-center gap-2 rounded-xl bg-secondary-container/40 px-3 py-2 text-sm text-on-secondary-fixed-variant">
                      <Check className="h-4 w-4" />
                      <span className="font-mono">
                        {order.shippingCarrier} · {order.trackingNumber}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handlePrintLabel(order)}
                      disabled={printingId === order.id}
                    >
                      <Printer className="h-4 w-4" />
                      {printingId === order.id
                        ? "Estimating rate…"
                        : "Print Shipping Label"}
                    </Button>
                  )}
                  {!order.trackingNumber && (
                    <span className="font-mono text-label-sm text-on-surface-variant">
                      Rates via Shippo / EasyPost mock
                    </span>
                  )}
                </div>
              )}

              {order.orderType === "LOCAL_DELIVERY" && (
                <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                  <Truck className="h-4 w-4" />
                  Assigned to local shopper — no shipping label required
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-on-surface-variant">
            Edit weight and temperature so local vs nationwide routing stays
            accurate.
          </p>
          {products.map((product, index) => {
            const editing = editingId === product.id;
            return (
              <article
                key={product.id}
                className="animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 md:p-5"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {product.name}
                    </h3>
                    <p className="font-mono text-label-sm text-on-surface-variant">
                      {REGION_LABELS[product.region]} ·{" "}
                      {formatCents(product.priceCents)} /{" "}
                      {product.unit.toLowerCase()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingId(editing ? null : product.id)
                    }
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {editing ? "Done" : "Edit"}
                  </Button>
                </div>

                {editing ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 font-mono text-label-sm text-on-surface-variant">
                        <Scale className="h-3.5 w-3.5" /> Weight (oz)
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={product.weightOz ?? 0}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            weightOz: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border-0 border-b-2 border-transparent bg-savanna-sand/80 px-3 py-2 outline-none focus:border-primary"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 flex items-center gap-1 font-mono text-label-sm text-on-surface-variant">
                        <Thermometer className="h-3.5 w-3.5" /> Temperature
                      </span>
                      <select
                        value={product.temperatureClass}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            temperatureClass: e.target
                              .value as Product["temperatureClass"],
                            shippable: e.target.value === "DRY",
                            localAvailable: e.target.value !== "DRY" ? true : product.localAvailable,
                          })
                        }
                        className="w-full rounded-lg border-0 border-b-2 border-transparent bg-savanna-sand/80 px-3 py-2 outline-none focus:border-primary"
                      >
                        <option value="FRESH">Fresh</option>
                        <option value="FROZEN">Frozen</option>
                        <option value="DRY">Dry</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
                        Stock qty
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={product.stockQty}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            stockQty: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border-0 border-b-2 border-transparent bg-savanna-sand/80 px-3 py-2 outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="muted">
                      {product.weightOz ?? "—"} oz
                    </Badge>
                    <Badge
                      tone={
                        product.temperatureClass === "DRY"
                          ? "primary"
                          : "secondary"
                      }
                    >
                      {TEMP_LABELS[product.temperatureClass]}
                    </Badge>
                    <Badge tone="muted">Stock {product.stockQty}</Badge>
                    {product.shippable && (
                      <Badge tone="primary">Shippable</Badge>
                    )}
                    {product.localAvailable && (
                      <Badge tone="secondary">Local</Badge>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderTypeBadge({ type }: { type: VendorOrder["orderType"] }) {
  if (type === "LOCAL_DELIVERY") {
    return (
      <Badge tone="secondary">
        <Truck className="mr-1 inline h-3 w-3" />
        Local
      </Badge>
    );
  }
  return (
    <Badge tone="primary">
      <Package className="mr-1 inline h-3 w-3" />
      Nationwide
    </Badge>
  );
}

function StatusBadge({ status }: { status: VendorOrder["status"] }) {
  const tone =
    status === "SHIPPED" || status === "DELIVERED"
      ? "secondary"
      : status === "LABEL_CREATED"
        ? "tertiary"
        : "muted";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}
