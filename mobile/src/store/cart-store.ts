import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  Address,
  CartItem,
  FeeBreakdown,
  FulfillmentType,
  Product,
} from '../types';

const LOCAL_DELIVERY_FEE_CENTS = 499;
const SERVICE_FEE_RATE = 0.05;
const TAX_RATE = 0.0825;
const DEFAULT_ORIGIN_STATE = 'TX';

interface CartState {
  items: CartItem[];
  tipCents: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  setTip: (tipCents: number) => void;
  toggleFulfillment: (itemId: string) => void;
}

/** Infer default fulfillment from product temperature / availability. */
export function defaultFulfillmentForProduct(
  product: Product
): FulfillmentType {
  if (
    product.temperatureClass === 'FRESH' ||
    product.temperatureClass === 'FROZEN'
  ) {
    return product.localAvailable
      ? 'LOCAL_DELIVERY'
      : 'NATIONWIDE_SHIPPING';
  }
  // DRY (and anything else): prefer local when available, else ship
  return product.localAvailable ? 'LOCAL_DELIVERY' : 'NATIONWIDE_SHIPPING';
}

function resolveItems(items?: CartItem[]): CartItem[] {
  return items ?? useCartStore.getState().items;
}

export function getLocalItems(items?: CartItem[]): CartItem[] {
  return resolveItems(items).filter((i) => i.fulfillment === 'LOCAL_DELIVERY');
}

export function getShippedItems(items?: CartItem[]): CartItem[] {
  return resolveItems(items).filter(
    (i) => i.fulfillment === 'NATIONWIDE_SHIPPING'
  );
}

export function getSubtotal(items?: CartItem[]): number {
  return resolveItems(items).reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
}

/** Mock weight-based shipping estimate (ounces → cents). */
export function estimateShippingFeeCents(
  shippedItems: CartItem[],
  address?: Address | null
): number {
  if (shippedItems.length === 0) return 0;

  const rawOz = shippedItems.reduce(
    (sum, item) => sum + (item.product.weightOz || 8) * item.quantity,
    0
  );
  const weightOz = Math.max(8, Math.ceil(rawOz * 1.1));
  const weightLb = weightOz / 16;
  const crossRegion = address
    ? address.state.toUpperCase() !== DEFAULT_ORIGIN_STATE
    : false;

  return 495 + Math.round(weightLb * 120) + (crossRegion ? 250 : 0);
}

/**
 * Fee breakdown for the current cart (or provided items).
 * Delivery $4.99 when local lines exist; shipping scales with parcel weight;
 * service 5%; tax 8.25%; tip from cart state unless overridden via tipCents arg.
 */
export function getFees(
  address?: Address | null,
  items?: CartItem[],
  tipCents?: number
): FeeBreakdown {
  const cart = useCartStore.getState();
  const lineItems = items ?? cart.items;
  const tip = tipCents ?? cart.tipCents;
  const localItems = getLocalItems(lineItems);
  const shippedItems = getShippedItems(lineItems);
  const subtotalCents = getSubtotal(lineItems);
  const localDeliveryFeeCents =
    localItems.length > 0 ? LOCAL_DELIVERY_FEE_CENTS : 0;
  const shippingFeeCents = estimateShippingFeeCents(shippedItems, address);
  const serviceFeeCents = Math.round(subtotalCents * SERVICE_FEE_RATE);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents =
    subtotalCents +
    localDeliveryFeeCents +
    shippingFeeCents +
    serviceFeeCents +
    tip +
    taxCents;

  return {
    subtotalCents,
    localDeliveryFeeCents,
    shippingFeeCents,
    serviceFeeCents,
    tipCents: tip,
    taxCents,
    totalCents,
  };
}

function makeCartItemId(productId: string, fulfillment: FulfillmentType): string {
  return `cart_${productId}_${fulfillment}`;
}

function canUseFulfillment(
  product: Product,
  fulfillment: FulfillmentType
): boolean {
  if (fulfillment === 'LOCAL_DELIVERY') return product.localAvailable;
  return product.shippable;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tipCents: 0,

      addItem: (product, qty = 1) => {
        const quantity = Math.max(1, Math.floor(qty));
        const fulfillment = defaultFulfillmentForProduct(product);
        const id = makeCartItemId(product.id, fulfillment);
        const existing = get().items.find((i) => i.id === id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity + quantity, product }
                : i
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            { id, product, quantity, fulfillment },
          ],
        });
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      setQuantity: (itemId, quantity) => {
        const next = Math.floor(quantity);
        if (next <= 0) {
          set({ items: get().items.filter((i) => i.id !== itemId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity: next } : i
          ),
        });
      },

      clear: () => set({ items: [], tipCents: 0 }),

      setTip: (tipCents) => set({ tipCents: Math.max(0, Math.round(tipCents)) }),

      toggleFulfillment: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        const nextFulfillment: FulfillmentType =
          item.fulfillment === 'LOCAL_DELIVERY'
            ? 'NATIONWIDE_SHIPPING'
            : 'LOCAL_DELIVERY';

        if (!canUseFulfillment(item.product, nextFulfillment)) return;

        const nextId = makeCartItemId(item.product.id, nextFulfillment);
        const sibling = get().items.find(
          (i) => i.id === nextId && i.id !== itemId
        );

        if (sibling) {
          // Merge into existing line with that fulfillment
          set({
            items: get()
              .items.filter((i) => i.id !== itemId)
              .map((i) =>
                i.id === nextId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
          });
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === itemId
              ? { ...i, id: nextId, fulfillment: nextFulfillment }
              : i
          ),
        });
      },
    }),
    {
      name: 'teedeux-cart',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        tipCents: state.tipCents,
      }),
    }
  )
);
