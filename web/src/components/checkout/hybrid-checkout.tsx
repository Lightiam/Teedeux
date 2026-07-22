"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Truck,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Address, CartItem, FeeBreakdown } from "@/lib/types";
import {
  cn,
  computeFees,
  formatAddress,
  formatCents,
  isValidUsPostalCode,
} from "@/lib/utils";
import { estimateShippingRates } from "@/lib/shipping";

interface HybridCheckoutProps {
  initialLocalItems: CartItem[];
  initialShippedItems: CartItem[];
  initialAddress: Address;
  initialTipCents?: number;
}

export function HybridCheckout({
  initialLocalItems,
  initialShippedItems,
  initialAddress,
  initialTipCents = 500,
}: HybridCheckoutProps) {
  const [localItems] = useState(initialLocalItems);
  const [shippedItems] = useState(initialShippedItems);
  const [address, setAddress] = useState(initialAddress);
  const [tipCents, setTipCents] = useState(initialTipCents);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  const rates = useMemo(
    () =>
      shippedItems.length
        ? estimateShippingRates(shippedItems, address)
        : [],
    [shippedItems, address]
  );

  const selectedRate =
    rates.find((r) => r.rateId === selectedRateId) ?? rates[0] ?? null;

  const fees: FeeBreakdown = useMemo(
    () =>
      computeFees(
        localItems,
        shippedItems,
        tipCents,
        selectedRate?.amountCents ?? 0
      ),
    [localItems, shippedItems, tipCents, selectedRate]
  );

  const addressValid =
    Boolean(address.line1.trim()) &&
    Boolean(address.city.trim()) &&
    Boolean(address.state.trim()) &&
    isValidUsPostalCode(address.postalCode);

  const tipPresets = [0, 300, 500, 800];

  if (placed) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-surface-container-lowest p-8 text-center shadow-warm-lg animate-fade-up">
        <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
        <h2 className="mt-4 font-display text-2xl font-bold text-on-surface">
          Order placed
        </h2>
        <p className="mt-2 text-on-surface-variant">
          Your hybrid order is split into{" "}
          {localItems.length > 0 && (
            <strong className="text-secondary">same-day local delivery</strong>
          )}
          {localItems.length > 0 && shippedItems.length > 0 && " and "}
          {shippedItems.length > 0 && (
            <strong className="text-primary">nationwide shipping</strong>
          )}
          .
        </p>
        <p className="mt-4 font-mono text-label-md text-on-surface">
          Total {formatCents(fees.totalCents)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-7">
        {/* Local cart */}
        <section className="animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container/50 text-secondary">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-on-surface">
                  Local Same-Day Delivery
                </h2>
                <p className="font-mono text-label-sm text-on-surface-variant">
                  Fresh & perishable · 2-hour window
                </p>
              </div>
            </div>
            <Badge tone="secondary">
              <Clock className="mr-1 inline h-3 w-3" />
              Today
            </Badge>
          </div>
          {localItems.length === 0 ? (
            <EmptyLane message="No local items in this order." />
          ) : (
            <ul className="divide-y divide-outline-variant/30">
              {localItems.map((item) => (
                <CartRow key={item.id} item={item} lane="local" />
              ))}
            </ul>
          )}
        </section>

        {/* Shipped cart */}
        <section
          className="animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 md:p-6"
          style={{ animationDelay: "80ms" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-on-surface">
                  Nationwide Shipped Standard
                </h2>
                <p className="font-mono text-label-sm text-on-surface-variant">
                  Dry goods · 2–4 business days
                </p>
              </div>
            </div>
            <Badge tone="primary">Ships US-wide</Badge>
          </div>
          {shippedItems.length === 0 ? (
            <EmptyLane message="No shipped items in this order." />
          ) : (
            <>
              <ul className="mb-4 divide-y divide-outline-variant/30">
                {shippedItems.map((item) => (
                  <CartRow key={item.id} item={item} lane="ship" />
                ))}
              </ul>
              <div className="space-y-2">
                <p className="font-mono text-label-sm text-on-surface-variant">
                  Carrier rates
                </p>
                {rates.map((rate) => (
                  <button
                    key={rate.rateId}
                    type="button"
                    onClick={() => setSelectedRateId(rate.rateId)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                      (selectedRate?.rateId ?? rates[0]?.rateId) === rate.rateId
                        ? "border-primary bg-primary-fixed/40 shadow-warm"
                        : "border-outline-variant/50 hover:border-outline"
                    )}
                  >
                    <span>
                      <span className="block font-semibold text-on-surface">
                        {rate.carrier} · {rate.service}
                      </span>
                      <span className="font-mono text-label-sm text-on-surface-variant">
                        Est. {rate.estimatedDays} days
                      </span>
                    </span>
                    <span className="font-display font-bold text-on-surface">
                      {formatCents(rate.amountCents)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Address */}
        <section
          className="animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 md:p-6"
          style={{ animationDelay: "160ms" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">
              Delivery address
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Street"
              className="sm:col-span-2"
              value={address.line1}
              onChange={(v) => setAddress((a) => ({ ...a, line1: v }))}
            />
            <Field
              label="Apt / Suite"
              className="sm:col-span-2"
              value={address.line2 ?? ""}
              onChange={(v) => setAddress((a) => ({ ...a, line2: v }))}
            />
            <Field
              label="City"
              value={address.city}
              onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="State"
                value={address.state}
                onChange={(v) =>
                  setAddress((a) => ({ ...a, state: v.toUpperCase().slice(0, 2) }))
                }
              />
              <Field
                label="ZIP"
                value={address.postalCode}
                onChange={(v) => setAddress((a) => ({ ...a, postalCode: v }))}
                invalid={
                  address.postalCode.length > 0 &&
                  !isValidUsPostalCode(address.postalCode)
                }
              />
            </div>
          </div>
          {!addressValid && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="h-4 w-4" />
              Enter a valid US delivery address to continue.
            </p>
          )}
          {addressValid && (
            <p className="mt-3 font-mono text-label-sm text-secondary">
              Delivering to {formatAddress(address)}
            </p>
          )}
        </section>
      </div>

      {/* Fee summary */}
      <aside className="lg:col-span-5">
        <div className="sticky top-24 animate-fade-up rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5 shadow-warm-lg md:p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <FeeRow label="Item subtotal" value={fees.subtotalCents} />
            <FeeRow
              label="Local delivery fee"
              value={fees.localDeliveryFeeCents}
              muted={fees.localDeliveryFeeCents === 0}
            />
            <FeeRow
              label="Shipping fee"
              value={fees.shippingFeeCents}
              muted={fees.shippingFeeCents === 0}
            />
            <FeeRow label="Service fee" value={fees.serviceFeeCents} />
            <FeeRow label="Est. tax" value={fees.taxCents} />
          </dl>

          <div className="mt-4">
            <p className="mb-2 font-mono text-label-sm text-on-surface-variant">
              Tip for shopper
            </p>
            <div className="flex flex-wrap gap-2">
              {tipPresets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipCents(t)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors",
                    tipCents === t
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface hover:bg-surface-container"
                  )}
                >
                  {t === 0 ? "None" : formatCents(t)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-outline-variant/40 pt-4">
            <span className="font-display text-lg font-bold">Total</span>
            <span className="font-display text-2xl font-extrabold text-primary">
              {formatCents(fees.totalCents)}
            </span>
          </div>

          <Button
            className="mt-5 w-full"
            size="lg"
            disabled={!addressValid || (localItems.length === 0 && shippedItems.length === 0)}
            onClick={() => setPlaced(true)}
          >
            Place hybrid order
          </Button>
          <p className="mt-3 text-center font-mono text-label-sm text-on-surface-variant">
            Local + shipped checkouts settle as one payment via Stripe Connect
          </p>
        </div>
      </aside>
    </div>
  );
}

function CartRow({
  item,
  lane,
}: {
  item: CartItem;
  lane: "local" | "ship";
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="font-semibold text-on-surface">{item.product.name}</p>
        <p className="font-mono text-label-sm text-on-surface-variant">
          {item.product.storeName} · qty {item.quantity}{" "}
          {item.product.unit.toLowerCase()}
          {lane === "local" && (
            <span className="text-secondary"> · {item.product.temperatureClass}</span>
          )}
          {lane === "ship" && item.product.weightOz && (
            <span> · {item.product.weightOz * item.quantity} oz</span>
          )}
        </p>
      </div>
      <p className="shrink-0 font-display font-bold">
        {formatCents(item.product.priceCents * item.quantity)}
      </p>
    </li>
  );
}

function FeeRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className={cn("font-mono", muted && "text-on-surface-variant")}>
        {value === 0 ? "—" : formatCents(value)}
      </dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  invalid?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-lg border-0 border-b-2 bg-savanna-sand/80 px-3 py-2.5 text-on-surface outline-none transition-colors focus:border-primary",
          invalid ? "border-error" : "border-transparent"
        )}
      />
    </label>
  );
}

function EmptyLane({ message }: { message: string }) {
  return (
    <p className="rounded-xl bg-surface-container px-4 py-6 text-center text-sm text-on-surface-variant">
      {message}
    </p>
  );
}
