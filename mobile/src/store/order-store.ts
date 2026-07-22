import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  DEMO_ADDRESS,
  DEMO_PAYMENT_METHODS,
  PRODUCTS,
  getStoreById,
} from '../data/catalog';
import type {
  Address,
  CartItem,
  FeeBreakdown,
  FulfillmentType,
  Order,
  OrderItem,
  OrderItemStatus,
  OrderStatus,
} from '../types';
import { useAuthStore } from './auth-store';

const MAMA_JONES_ID = 'store_mama_jones';
const SHOPPER_DEMO_IDS = ['ord_shopper_demo_1', 'ord_shopper_demo_2'] as const;

const LOCAL_STATUS_FLOW: OrderStatus[] = [
  'CONFIRMED',
  'SHOPPING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const SHIPPED_STATUS_FLOW: OrderStatus[] = [
  'CONFIRMED',
  'LABEL_CREATED',
  'SHIPPED',
  'DELIVERED',
];

interface PlaceOrderInput {
  address: Address;
  paymentMethodId: string;
  tipCents: number;
  localItems: CartItem[];
  shippedItems: CartItem[];
  fees: FeeBreakdown;
}

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  placeOrder: (input: PlaceOrderInput) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderItemStatus: (
    orderId: string,
    itemId: string,
    status: OrderItemStatus,
    substitutionNote?: string
  ) => void;
  seedShopperDemoOrders: () => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersForUser: (userId: string) => Order[];
  setActiveOrder: (orderId: string | null) => void;
}

function createOrderNumber(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `TDX-${n}`;
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    id: createId('oi'),
    productId: item.product.id,
    productName: item.product.name,
    productImageUrl: item.product.imageUrl,
    quantity: item.quantity,
    unitPriceCents: item.product.priceCents,
    unit: item.product.unit,
    status: 'PENDING' as const,
    fulfillment: item.fulfillment,
  }));
}

function subtotalFor(items: CartItem[]): number {
  return items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );
}

function allocateFees(
  fulfillment: FulfillmentType,
  items: CartItem[],
  fees: FeeBreakdown,
  tipCents: number,
  hasBoth: boolean
): FeeBreakdown {
  const subtotalCents = subtotalFor(items);
  const share =
    hasBoth && fees.subtotalCents > 0
      ? subtotalCents / fees.subtotalCents
      : 1;

  const serviceFeeCents = Math.round(fees.serviceFeeCents * share);
  const taxCents = Math.round(fees.taxCents * share);
  const tipShare = Math.round(tipCents * share);

  const localDeliveryFeeCents =
    fulfillment === 'LOCAL_DELIVERY' ? fees.localDeliveryFeeCents : 0;
  const shippingFeeCents =
    fulfillment === 'NATIONWIDE_SHIPPING' ? fees.shippingFeeCents : 0;

  return {
    subtotalCents,
    localDeliveryFeeCents,
    shippingFeeCents,
    serviceFeeCents,
    tipCents: tipShare,
    taxCents,
    totalCents:
      subtotalCents +
      localDeliveryFeeCents +
      shippingFeeCents +
      serviceFeeCents +
      tipShare +
      taxCents,
  };
}

function buildOrder(params: {
  items: CartItem[];
  fulfillment: FulfillmentType;
  address: Address;
  paymentMethodId: string;
  fees: FeeBreakdown;
  userId: string;
  status: OrderStatus;
  trackingNumber?: string;
}): Order {
  const first = params.items[0]!;
  const now = new Date().toISOString();

  return {
    id: createId('ord'),
    orderNumber: createOrderNumber(),
    userId: params.userId,
    storeId: first.product.storeId,
    storeName: first.product.storeName,
    status: params.status,
    fulfillmentType: params.fulfillment,
    items: cartItemsToOrderItems(params.items),
    deliveryAddress: params.address,
    paymentMethodId: params.paymentMethodId,
    fees: params.fees,
    trackingNumber: params.trackingNumber,
    createdAt: now,
    updatedAt: now,
  };
}

function mockTrackingNumber(): string {
  return `9400${Date.now().toString().slice(-16)}`;
}

function buildShopperDemoOrders(): Order[] {
  const store = getStoreById(MAMA_JONES_ID);
  const storeName = store?.name ?? 'Mama Jones African Market';
  const mamaProducts = PRODUCTS.filter((p) => p.storeId === MAMA_JONES_ID);
  const now = new Date().toISOString();
  const paymentId = DEMO_PAYMENT_METHODS[0]?.id ?? 'pm_visa_4242';

  const batchA = mamaProducts.slice(0, 4);
  const batchB = mamaProducts.slice(4, 7);

  const toItems = (products: typeof mamaProducts, prefix: string): OrderItem[] =>
    products.map((p, i) => ({
      id: `${prefix}_oi_${i}`,
      productId: p.id,
      productName: p.name,
      productImageUrl: p.imageUrl,
      quantity: i === 0 ? 2 : 1,
      unitPriceCents: p.priceCents,
      unit: p.unit,
      status: 'PENDING' as const,
      fulfillment: 'LOCAL_DELIVERY' as const,
    }));

  const feesFor = (items: OrderItem[], tipCents: number): FeeBreakdown => {
    const subtotalCents = items.reduce(
      (sum, it) => sum + it.unitPriceCents * it.quantity,
      0
    );
    const localDeliveryFeeCents = 399;
    const serviceFeeCents = Math.round(subtotalCents * 0.08);
    const taxCents = Math.round(subtotalCents * 0.08);
    return {
      subtotalCents,
      localDeliveryFeeCents,
      shippingFeeCents: 0,
      serviceFeeCents,
      tipCents,
      taxCents,
      totalCents:
        subtotalCents +
        localDeliveryFeeCents +
        serviceFeeCents +
        tipCents +
        taxCents,
    };
  };

  const itemsA = toItems(batchA, 'demo1');
  const itemsB = toItems(batchB, 'demo2');

  return [
    {
      id: SHOPPER_DEMO_IDS[0],
      orderNumber: 'TDX-84021',
      userId: 'user_demo_customer_a',
      storeId: MAMA_JONES_ID,
      storeName,
      status: 'CONFIRMED',
      fulfillmentType: 'LOCAL_DELIVERY',
      items: itemsA,
      deliveryAddress: DEMO_ADDRESS!,
      paymentMethodId: paymentId,
      fees: feesFor(itemsA, 400),
      createdAt: now,
      updatedAt: now,
      notes: 'Shopper demo batch — leave at door',
    },
    {
      id: SHOPPER_DEMO_IDS[1],
      orderNumber: 'TDX-84055',
      userId: 'user_demo_customer_b',
      storeId: MAMA_JONES_ID,
      storeName,
      status: 'SHOPPING',
      fulfillmentType: 'LOCAL_DELIVERY',
      items: itemsB,
      deliveryAddress: DEMO_ADDRESS!,
      paymentMethodId: paymentId,
      fees: feesFor(itemsB, 250),
      createdAt: now,
      updatedAt: now,
      notes: 'Shopper demo batch — call on arrival',
    },
  ];
}

function isAllowedTransition(
  fulfillment: FulfillmentType,
  from: OrderStatus,
  to: OrderStatus
): boolean {
  if (to === 'CANCELLED' || to === 'REFUNDED') return true;
  const flow =
    fulfillment === 'LOCAL_DELIVERY' ? LOCAL_STATUS_FLOW : SHIPPED_STATUS_FLOW;
  const fromIdx = flow.indexOf(from);
  const toIdx = flow.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return false;
  return toIdx >= fromIdx;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: null,

      placeOrder: ({
        address,
        paymentMethodId,
        tipCents,
        localItems,
        shippedItems,
        fees,
      }) => {
        const userId = useAuthStore.getState().user?.id ?? 'guest';
        const hasBoth = localItems.length > 0 && shippedItems.length > 0;
        const created: Order[] = [];

        if (localItems.length > 0) {
          created.push(
            buildOrder({
              items: localItems,
              fulfillment: 'LOCAL_DELIVERY',
              address,
              paymentMethodId,
              fees: allocateFees(
                'LOCAL_DELIVERY',
                localItems,
                fees,
                tipCents,
                hasBoth
              ),
              userId,
              // Local orders enter the shopping flow immediately
              status: 'SHOPPING',
            })
          );
        }

        if (shippedItems.length > 0) {
          created.push(
            buildOrder({
              items: shippedItems,
              fulfillment: 'NATIONWIDE_SHIPPING',
              address,
              paymentMethodId,
              fees: allocateFees(
                'NATIONWIDE_SHIPPING',
                shippedItems,
                fees,
                tipCents,
                hasBoth
              ),
              userId,
              status: 'CONFIRMED',
            })
          );
        }

        if (created.length === 0) return [];

        set({
          orders: [...created, ...get().orders],
          activeOrderId: created[0]!.id,
        });

        return created;
      },

      updateOrderStatus: (orderId, status) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        if (!isAllowedTransition(order.fulfillmentType, order.status, status)) {
          return;
        }

        const now = new Date().toISOString();
        const trackingNumber =
          order.fulfillmentType === 'NATIONWIDE_SHIPPING' &&
          (status === 'LABEL_CREATED' || status === 'SHIPPED') &&
          !order.trackingNumber
            ? mockTrackingNumber()
            : order.trackingNumber;

        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  trackingNumber,
                  shippingCarrier:
                    trackingNumber && !o.shippingCarrier
                      ? 'USPS'
                      : o.shippingCarrier,
                  updatedAt: now,
                }
              : o
          ),
        });
      },

      updateOrderItemStatus: (orderId, itemId, status, substitutionNote) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;
        const now = new Date().toISOString();
        set({
          orders: get().orders.map((o) =>
            o.id !== orderId
              ? o
              : {
                  ...o,
                  updatedAt: now,
                  items: o.items.map((item) =>
                    item.id !== itemId
                      ? item
                      : {
                          ...item,
                          status,
                          substitutionNote:
                            substitutionNote ?? item.substitutionNote,
                        }
                  ),
                }
          ),
        });
      },

      seedShopperDemoOrders: () => {
        const existing = get().orders;
        const missing = SHOPPER_DEMO_IDS.filter(
          (id) => !existing.some((o) => o.id === id)
        );
        if (missing.length === 0) return;
        const demos = buildShopperDemoOrders().filter((o) =>
          missing.includes(o.id as (typeof SHOPPER_DEMO_IDS)[number])
        );
        if (demos.length === 0) return;
        set({ orders: [...demos, ...existing] });
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),

      getOrdersForUser: (userId) =>
        get().orders.filter((o) => o.userId === userId),

      setActiveOrder: (orderId) => set({ activeOrderId: orderId }),
    }),
    {
      name: 'teedeux-orders',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        orders: state.orders,
        activeOrderId: state.activeOrderId,
      }),
    }
  )
);
