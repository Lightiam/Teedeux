import type { Order } from '../types';

/** Shopper payout: $2 base + $0.75/item + tip share */
export function estimateShopperPayoutCents(order: Order): number {
  const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);
  return 200 + Math.round(75 * itemCount) + (order.fees.tipCents ?? 0);
}
