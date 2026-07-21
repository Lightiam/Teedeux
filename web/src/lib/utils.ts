import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartItem, FeeBreakdown, OrderType, Product } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatUnit(unit: string, qty: number): string {
  const label = unit.toLowerCase();
  if (qty === 1 && label === "each") return "ea";
  return `${qty} ${label}`;
}

/** Split cart items into local same-day vs nationwide shipping */
export function splitCartByFulfillment(items: CartItem[]): {
  localItems: CartItem[];
  shippedItems: CartItem[];
} {
  return {
    localItems: items.filter((i) => i.fulfillment === "LOCAL_DELIVERY"),
    shippedItems: items.filter((i) => i.fulfillment === "NATIONWIDE_SHIPPING"),
  };
}

/** Infer default fulfillment from product temperature / availability */
export function defaultFulfillmentForProduct(product: Product): OrderType {
  if (
    product.temperatureClass === "FRESH" ||
    product.temperatureClass === "FROZEN"
  ) {
    return product.localAvailable ? "LOCAL_DELIVERY" : "NATIONWIDE_SHIPPING";
  }
  if (product.localAvailable) return "LOCAL_DELIVERY";
  if (product.shippable) return "NATIONWIDE_SHIPPING";
  return "LOCAL_DELIVERY";
}

export function computeFees(
  localItems: CartItem[],
  shippedItems: CartItem[],
  tipCents = 0,
  shippingFeeCents = 0
): FeeBreakdown {
  const localSub = localItems.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );
  const shipSub = shippedItems.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );
  const subtotalCents = localSub + shipSub;
  const localDeliveryFeeCents = localItems.length > 0 ? 499 : 0;
  const serviceFeeCents = Math.round(subtotalCents * 0.05);
  const taxCents = Math.round(subtotalCents * 0.0825);
  const totalCents =
    subtotalCents +
    localDeliveryFeeCents +
    shippingFeeCents +
    serviceFeeCents +
    tipCents +
    taxCents;

  return {
    subtotalCents,
    localDeliveryFeeCents,
    shippingFeeCents,
    serviceFeeCents,
    tipCents,
    taxCents,
    totalCents,
  };
}

export function isValidUsPostalCode(code: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(code.trim());
}

export function formatAddress(parts: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}): string {
  const street = parts.line2 ? `${parts.line1}, ${parts.line2}` : parts.line1;
  return `${street}, ${parts.city}, ${parts.state} ${parts.postalCode}`;
}
