/**
 * Shared TypeScript types for the Teedeux African grocery mobile app.
 * Dual fulfillment: local same-day delivery + nationwide shipping.
 */

export type UserRole = 'CUSTOMER' | 'SHOPPER' | 'VENDOR' | 'ADMIN';

/** Store-level capability */
export type StoreFulfillmentMode = 'LOCAL_ONLY' | 'SHIPPING_ONLY' | 'BOTH';

/** Cart / order fulfillment channel */
export type FulfillmentType = 'LOCAL_DELIVERY' | 'NATIONWIDE_SHIPPING';

export type RegionCategory =
  | 'WEST_AFRICAN'
  | 'EAST_AFRICAN'
  | 'CENTRAL_AFRICAN'
  | 'NORTH_AFRICAN'
  | 'SOUTHERN_AFRICAN'
  | 'CARIBBEAN'
  | 'GENERAL';

export type TemperatureClass = 'FRESH' | 'FROZEN' | 'DRY';

export type ProductUnit = 'EACH' | 'LB' | 'OZ' | 'KG' | 'G' | 'BUNCH' | 'PACK';

export type ProductCategory =
  | 'Spices'
  | 'Grains'
  | 'Fresh Produce'
  | 'Meat & Seafood'
  | 'Oils'
  | 'Frozen'
  | 'Snacks'
  | 'Pantry';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHOPPING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'LABEL_CREATED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type OrderItemStatus =
  | 'PENDING'
  | 'FOUND'
  | 'SUBSTITUTION_PENDING'
  | 'SUBSTITUTED'
  | 'REFUNDED'
  | 'UNAVAILABLE';

export type PaymentMethodType = 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY';

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';

export interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  defaultAddressId?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  brand?: CardBrand;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  fulfillmentType: StoreFulfillmentMode;
  localRadiusMiles: number;
  address: Address;
  regionFocus: RegionCategory[];
  rating?: number;
  reviewCount?: number;
  estimatedDeliveryMins?: number;
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  slug?: string;
  description: string;
  imageUrl: string;
  region: RegionCategory;
  temperatureClass: TemperatureClass;
  unit: ProductUnit;
  priceCents: number;
  weightOz: number;
  stockQty: number;
  isWeighted?: boolean;
  shippable: boolean;
  localAvailable: boolean;
  category: ProductCategory;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  fulfillment: FulfillmentType;
}

export interface FeeBreakdown {
  subtotalCents: number;
  localDeliveryFeeCents: number;
  shippingFeeCents: number;
  serviceFeeCents: number;
  tipCents: number;
  taxCents: number;
  totalCents: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPriceCents: number;
  unit: ProductUnit;
  status: OrderItemStatus;
  fulfillment: FulfillmentType;
  substitutionNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  storeId: string;
  storeName: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethodId?: string;
  fees: FeeBreakdown;
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDeliveryAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CategoryMeta {
  id: ProductCategory;
  label: string;
  icon: string;
  description?: string;
}

export interface RecipeBundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  region: RegionCategory;
  imageUrl: string;
  servings: number;
  prepMinutes: number;
  productIds: string[];
  tags: string[];
}

export const REGION_LABELS: Record<RegionCategory, string> = {
  WEST_AFRICAN: 'West African',
  EAST_AFRICAN: 'East African',
  CENTRAL_AFRICAN: 'Central African',
  NORTH_AFRICAN: 'North African',
  SOUTHERN_AFRICAN: 'Southern African',
  CARIBBEAN: 'Caribbean',
  GENERAL: 'General',
};

export const TEMP_LABELS: Record<TemperatureClass, string> = {
  FRESH: 'Fresh',
  FROZEN: 'Frozen',
  DRY: 'Dry / Shelf-stable',
};

export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  LOCAL_DELIVERY: 'Local delivery',
  NATIONWIDE_SHIPPING: 'Nationwide shipping',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHOPPING: 'Shopping',
  READY_FOR_DELIVERY: 'Ready for delivery',
  OUT_FOR_DELIVERY: 'Out for delivery',
  LABEL_CREATED: 'Label created',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};
