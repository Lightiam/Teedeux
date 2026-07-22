/** Shared TypeScript interfaces for Teedeux dual-fulfillment platform */

export type UserRole = "CUSTOMER" | "SHOPPER" | "VENDOR" | "ADMIN";

export type FulfillmentType = "LOCAL_ONLY" | "SHIPPING_ONLY" | "BOTH";

export type RegionCategory =
  | "WEST_AFRICAN"
  | "EAST_AFRICAN"
  | "CENTRAL_AFRICAN"
  | "NORTH_AFRICAN"
  | "SOUTHERN_AFRICAN"
  | "CARIBBEAN"
  | "GENERAL";

export type TemperatureClass = "FRESH" | "FROZEN" | "DRY";

export type ProductUnit = "EACH" | "LB" | "OZ" | "KG" | "G" | "BUNCH" | "PACK";

export type OrderType = "LOCAL_DELIVERY" | "NATIONWIDE_SHIPPING";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHOPPING"
  | "READY_FOR_DELIVERY"
  | "OUT_FOR_DELIVERY"
  | "LABEL_CREATED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItemStatus =
  | "PENDING"
  | "FOUND"
  | "SUBSTITUTION_PENDING"
  | "SUBSTITUTED"
  | "REFUNDED"
  | "UNAVAILABLE";

export type DeliveryStatus =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "EN_ROUTE_TO_STORE"
  | "SHOPPING"
  | "EN_ROUTE_TO_CUSTOMER"
  | "DELIVERED"
  | "CANCELLED";

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
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  fulfillmentType: FulfillmentType;
  localRadiusMiles: number;
  address: Address;
  regionFocus: RegionCategory[];
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  region: RegionCategory;
  temperatureClass: TemperatureClass;
  unit: ProductUnit;
  priceCents: number;
  weightOz?: number;
  stockQty: number;
  isWeighted: boolean;
  shippable: boolean;
  localAvailable: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  /** Determined at add-to-cart / checkout split */
  fulfillment: OrderType;
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

export interface HybridCart {
  localItems: CartItem[];
  shippedItems: CartItem[];
  address: Address | null;
  fees: FeeBreakdown;
}

export interface OrderItemView {
  id: string;
  product: Product;
  quantity: number;
  unitPriceCents: number;
  status: OrderItemStatus;
  substitutionNote?: string;
}

export interface VendorOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  customerName: string;
  createdAt: string;
  items: OrderItemView[];
  subtotalCents: number;
  shippingFeeCents: number;
  totalCents: number;
  shippingAddress: Address;
  trackingNumber?: string;
  shippingLabelUrl?: string;
  shippingCarrier?: string;
}

export interface ShopperOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  store: Store;
  customerName: string;
  customerAddress: Address;
  items: OrderItemView[];
  payoutCents: number;
  itemCount: number;
  deliveryNotes?: string;
}

export interface ShippingRateEstimate {
  carrier: string;
  service: string;
  amountCents: number;
  estimatedDays: number;
  rateId: string;
}

export interface SubstitutionSuggestion {
  name: string;
  priceCents: number;
  note?: string;
}

export const REGION_LABELS: Record<RegionCategory, string> = {
  WEST_AFRICAN: "West African",
  EAST_AFRICAN: "East African",
  CENTRAL_AFRICAN: "Central African",
  NORTH_AFRICAN: "North African",
  SOUTHERN_AFRICAN: "Southern African",
  CARIBBEAN: "Caribbean",
  GENERAL: "General",
};

export const TEMP_LABELS: Record<TemperatureClass, string> = {
  FRESH: "Fresh",
  FROZEN: "Frozen",
  DRY: "Dry / Shelf-stable",
};
