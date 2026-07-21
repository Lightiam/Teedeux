import type { Address, CartItem, ShippingRateEstimate } from "./types";

/** Estimate parcel weight from cart items (ounces) */
export function estimateParcelWeightOz(items: CartItem[]): number {
  const raw = items.reduce(
    (sum, item) => sum + (item.product.weightOz ?? 8) * item.quantity,
    0
  );
  // Packaging buffer
  return Math.max(8, Math.ceil(raw * 1.1));
}

/**
 * Mock Shippo/EasyPost rate estimate.
 * Replace with live API: POST https://api.goshippo.com/shipments/
 */
export function estimateShippingRates(
  items: CartItem[],
  toAddress: Address,
  fromState = "TX"
): ShippingRateEstimate[] {
  const weightOz = estimateParcelWeightOz(items);
  const weightLb = weightOz / 16;
  const crossRegion = toAddress.state !== fromState;
  const base = 495 + Math.round(weightLb * 120) + (crossRegion ? 250 : 0);

  return [
    {
      carrier: "USPS",
      service: "Priority Mail",
      amountCents: base,
      estimatedDays: crossRegion ? 3 : 2,
      rateId: `rate_usps_${weightOz}`,
    },
    {
      carrier: "UPS",
      service: "Ground",
      amountCents: base + 320,
      estimatedDays: crossRegion ? 4 : 2,
      rateId: `rate_ups_${weightOz}`,
    },
    {
      carrier: "FedEx",
      service: "Home Delivery",
      amountCents: base + 280,
      estimatedDays: crossRegion ? 3 : 2,
      rateId: `rate_fedex_${weightOz}`,
    },
  ].sort((a, b) => a.amountCents - b.amountCents);
}

export function mockCreateShippingLabel(input: {
  orderNumber: string;
  rateId: string;
  carrier: string;
}): { trackingNumber: string; labelUrl: string; carrier: string } {
  const trackingNumber = `9400${Date.now().toString().slice(-16)}`;
  return {
    trackingNumber,
    labelUrl: `https://example.com/labels/${input.orderNumber}.pdf`,
    carrier: input.carrier,
  };
}
