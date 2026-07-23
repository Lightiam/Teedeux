/**
 * In-memory Teedeux commerce backend for Next.js API routes.
 * Mirrors html/js/backend.js so local `next dev` and monitoring work without Postgres.
 */

export type MoneyCents = number;

type Product = {
  id: string;
  name: string;
  size: string;
  category: string;
  priceCents: MoneyCents;
  compareAtCents?: MoneyCents;
  badge?: string;
  imageUrl: string;
  description: string;
};

type CartLine = { productId: string; quantity: number };
type Coupon = {
  id: string;
  code: string;
  title: string;
  expires: string;
  claimed: boolean;
  percent: number;
  imageUrl: string;
};
type Address = {
  id: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  selected: boolean;
};
type Payment = { id: string; brand: string; last4: string; selected: boolean };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  tab: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    size: string;
    imageUrl: string;
    unitCents: number;
    quantity: number;
    lineCents: number;
  }>;
  totals: {
    subtotalCents: number;
    discountCents: number;
    deliveryCents: number;
    totalCents: number;
  };
  address: Address;
  payment: { brand: string; last4: string };
  courier: { name: string; title: string; phone: string; avatar: string };
  timeline: Array<{ key: string; label: string; status: string; at: string | null }>;
};

type EventRow = { id: string; at: string; type: string; detail: Record<string, unknown> };

const DELIVERY_FEE_CENTS = 2000;

const CATEGORIES = [
  { id: "Staples", name: "Staples", label: "Pounded Yam, Fufu & Gari", imageUrl: "/img/products/pounded-yam-flour.jpg" },
  { id: "Spices", name: "Spices", label: "Egusi, Suya & Berbere", imageUrl: "/img/products/egusi-seeds.jpg" },
  { id: "Oils", name: "Oils", label: "Red Palm Oil & Pastes", imageUrl: "/img/products/red-palm-oil.jpg" },
  { id: "Produce", name: "Produce", label: "Plantains, Peppers & Greens", imageUrl: "/img/products/ripe-plantains.jpg" },
  { id: "Protein", name: "Protein", label: "Stockfish, Goat & Crayfish", imageUrl: "/img/products/stockfish.jpg" },
  { id: "Snacks", name: "Snacks", label: "Plantain Chips & Chin Chin", imageUrl: "/img/products/plantain-chips.jpg" },
  { id: "Drinks", name: "Drinks", label: "Zobo Leaves & Coffee", imageUrl: "/img/products/zobo-leaves.jpg" },
];

const PRODUCTS: Product[] = [
  { id: "jollof-rice", name: "Jollof Rice", size: "32 oz tray", category: "Staples", priceCents: 899, badge: "BEST SALE", imageUrl: "/img/products/jollof-rice.jpg", description: "Party-style West African jollof rice." },
  { id: "ripe-plantains", name: "Ripe Plantains", size: "3 ct", category: "Produce", priceCents: 349, compareAtCents: 449, badge: "10% OFF", imageUrl: "/img/products/ripe-plantains.jpg", description: "Sweet ripe plantains for dodo." },
  { id: "pounded-yam-flour", name: "Pounded Yam Flour", size: "2 lb bag", category: "Staples", priceCents: 1299, imageUrl: "/img/products/pounded-yam-flour.jpg", description: "Smooth pounded yam flour." },
  { id: "egusi-seeds", name: "Egusi Melon Seeds", size: "16 oz", category: "Spices", priceCents: 999, imageUrl: "/img/products/egusi-seeds.jpg", description: "Egusi seeds for soup." },
  { id: "red-palm-oil", name: "Red Palm Oil", size: "1 L bottle", category: "Oils", priceCents: 1499, badge: "BEST SALE", imageUrl: "/img/products/red-palm-oil.jpg", description: "Unrefined red palm oil." },
  { id: "stockfish", name: "Stockfish", size: "8 oz pack", category: "Protein", priceCents: 1899, imageUrl: "/img/products/stockfish.jpg", description: "Premium dried stockfish." },
  { id: "suya-spice", name: "Suya Spice Blend", size: "4 oz jar", category: "Spices", priceCents: 699, imageUrl: "/img/products/suya-spice.jpg", description: "Smoky suya spice." },
  { id: "plantain-chips", name: "Plantain Chips", size: "6 oz bag", category: "Snacks", priceCents: 399, compareAtCents: 499, badge: "18% OFF", imageUrl: "/img/products/plantain-chips.jpg", description: "Crispy plantain chips." },
  { id: "fufu-flour", name: "Fufu Flour", size: "1.5 lb", category: "Staples", priceCents: 1099, imageUrl: "/img/products/fufu-flour.jpg", description: "Quick fufu flour." },
  { id: "gari-white", name: "White Gari (Garri)", size: "2 lb bag", category: "Staples", priceCents: 799, imageUrl: "/img/products/gari-white.jpg", description: "Fine white gari." },
  { id: "chin-chin", name: "Chin Chin", size: "10 oz", category: "Snacks", priceCents: 549, compareAtCents: 649, badge: "10% OFF", imageUrl: "/img/products/chin-chin.jpg", description: "Crunchy chin chin." },
  { id: "zobo-leaves", name: "Zobo (Hibiscus) Leaves", size: "8 oz", category: "Drinks", priceCents: 649, imageUrl: "/img/products/zobo-leaves.jpg", description: "Dried hibiscus for zobo." },
];

type State = {
  cart: { items: CartLine[]; promoCode: string | null };
  favorites: string[];
  coupons: Coupon[];
  addresses: Address[];
  payments: Payment[];
  orders: Order[];
  reviews: Record<string, { rating: number; text: string; at: string }>;
  events: EventRow[];
};

const g = globalThis as typeof globalThis & { __teedeuxCommerce?: State };

function state(): State {
  if (!g.__teedeuxCommerce) {
    g.__teedeuxCommerce = {
      cart: { items: [], promoCode: null },
      favorites: [],
      coupons: [
        { id: "c1", code: "PALM10", title: "10% Red Palm Oil", expires: "2026-12-31", claimed: false, percent: 10, imageUrl: "/img/products/red-palm-oil.jpg" },
        { id: "c2", code: "PLANTAIN25", title: "25% Plantain Sale", expires: "2026-11-30", claimed: false, percent: 25, imageUrl: "/img/products/ripe-plantains.jpg" },
        { id: "c3", code: "EGUSI15", title: "15% Egusi Seeds", expires: "2026-10-31", claimed: false, percent: 15, imageUrl: "/img/products/egusi-seeds.jpg" },
      ],
      addresses: [
        { id: "addr_home", label: "Home Address", line1: "1200 Peachtree St NE", city: "Atlanta", state: "GA", postalCode: "30309", selected: true },
        { id: "addr_office", label: "Office Address", line1: "6100 Richmond Ave", city: "Houston", state: "TX", postalCode: "77057", selected: false },
      ],
      payments: [
        { id: "pay_mc", brand: "Master Card", last4: "5588", selected: true },
        { id: "pay_visa", brand: "Visa Card", last4: "4242", selected: false },
        { id: "pay_cod", brand: "Cash on Delivery", last4: "", selected: false },
      ],
      orders: [],
      reviews: {},
      events: [],
    };
  }
  return g.__teedeuxCommerce;
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function pushEvent(type: string, detail: Record<string, unknown>) {
  const s = state();
  s.events.unshift({ id: uid("evt"), at: new Date().toISOString(), type, detail });
  s.events = s.events.slice(0, 200);
}

function product(id: string) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function cartLines() {
  return state()
    .cart.items.map((line) => {
      const p = product(line.productId);
      if (!p) return null;
      return {
        productId: p.id,
        name: p.name,
        size: p.size,
        imageUrl: p.imageUrl,
        unitCents: p.priceCents,
        quantity: line.quantity,
        lineCents: p.priceCents * line.quantity,
      };
    })
    .filter(Boolean) as Array<{
    productId: string;
    name: string;
    size: string;
    imageUrl: string;
    unitCents: number;
    quantity: number;
    lineCents: number;
  }>;
}

function totals() {
  const lines = cartLines();
  const subtotal = lines.reduce((n, l) => n + l.lineCents, 0);
  const coupon = state().coupons.find((c) => c.code === state().cart.promoCode && c.claimed);
  const discount = coupon ? Math.round(subtotal * (coupon.percent / 100)) : 0;
  const delivery = lines.length ? DELIVERY_FEE_CENTS : 0;
  return {
    subtotalCents: subtotal,
    discountCents: discount,
    deliveryCents: delivery,
    totalCents: Math.max(0, subtotal - discount + delivery),
    itemCount: lines.reduce((n, l) => n + l.quantity, 0),
    promoCode: state().cart.promoCode,
  };
}

export function listCategories() {
  return CATEGORIES.map((c) => ({
    ...c,
    count: PRODUCTS.filter((p) => p.category === c.id).length,
  }));
}

export function listProducts(opts: { category?: string; q?: string } = {}) {
  let list = PRODUCTS.slice();
  if (opts.category) list = list.filter((p) => p.category === opts.category);
  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  return list;
}

export function getCart() {
  return { items: cartLines(), totals: totals(), promoCode: state().cart.promoCode };
}

export function addToCart(productId: string, qty = 1) {
  const s = state();
  const found = s.cart.items.find((i) => i.productId === productId);
  if (found) found.quantity += Math.max(1, qty);
  else s.cart.items.push({ productId, quantity: Math.max(1, qty) });
  pushEvent("cart.add", { productId, qty });
  return getCart();
}

export function setQty(productId: string, qty: number) {
  const s = state();
  if (qty <= 0) s.cart.items = s.cart.items.filter((i) => i.productId !== productId);
  else s.cart.items.forEach((i) => {
    if (i.productId === productId) i.quantity = qty;
  });
  pushEvent("cart.qty", { productId, qty });
  return getCart();
}

export function removeFromCart(productId: string) {
  state().cart.items = state().cart.items.filter((i) => i.productId !== productId);
  pushEvent("cart.remove", { productId });
  return getCart();
}

export function applyPromo(code: string) {
  const normalized = String(code || "").trim().toUpperCase();
  const coupon = state().coupons.find((c) => c.code === normalized);
  if (!coupon) return { ok: false as const, error: "Invalid coupon code" };
  coupon.claimed = true;
  state().cart.promoCode = normalized;
  pushEvent("coupon.apply", { code: normalized });
  return { ok: true as const, cart: getCart() };
}

export function listCoupons() {
  return state().coupons.slice();
}

export function claimCoupon(idOrCode: string) {
  const c = state().coupons.find((x) => x.id === idOrCode || x.code === idOrCode);
  if (!c) return { ok: false as const, error: "Coupon not found" };
  c.claimed = true;
  pushEvent("coupon.claim", { code: c.code });
  return { ok: true as const, coupon: c };
}

export function listAddresses() {
  return state().addresses.slice();
}
export function selectAddress(id: string) {
  state().addresses.forEach((a) => {
    a.selected = a.id === id;
  });
  return listAddresses();
}
export function listPayments() {
  return state().payments.slice();
}
export function selectPayment(id: string) {
  state().payments.forEach((p) => {
    p.selected = p.id === id;
  });
  return listPayments();
}

export function checkout() {
  const cart = getCart();
  if (!cart.items.length) return { ok: false as const, error: "Cart is empty" };
  const addr = state().addresses.find((a) => a.selected);
  const pay = state().payments.find((p) => p.selected);
  if (!addr) return { ok: false as const, error: "Select a delivery address" };
  if (!pay) return { ok: false as const, error: "Select a payment method" };
  const now = new Date();
  const order: Order = {
    id: uid("ord"),
    orderNumber: `TDX-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "PROCESSING",
    tab: "Processing",
    createdAt: now.toISOString(),
    items: cart.items,
    totals: {
      subtotalCents: cart.totals.subtotalCents,
      discountCents: cart.totals.discountCents,
      deliveryCents: cart.totals.deliveryCents,
      totalCents: cart.totals.totalCents,
    },
    address: addr,
    payment: { brand: pay.brand, last4: pay.last4 },
    courier: {
      name: "Ada Okonkwo",
      title: "Teedeux Delivery Partner",
      phone: "+1 (404) 555-0142",
      avatar: "/img/stores/mama-jones.jpg",
    },
    timeline: [
      { key: "paid", label: "Payment Has Been Verified", status: "Completed", at: now.toISOString() },
      { key: "pickup", label: "Waiting for Pick Up", status: "On Transit", at: null },
      { key: "courier", label: "Being Sent by Courier", status: "Pending", at: null },
      { key: "complete", label: "Order Complete", status: "Pending", at: null },
    ],
  };
  state().orders.unshift(order);
  state().cart.items = [];
  state().cart.promoCode = null;
  pushEvent("order.created", { orderNumber: order.orderNumber, totalCents: order.totals.totalCents });
  setTimeout(() => advanceOrder(order.id, "pickup"), 3000);
  setTimeout(() => advanceOrder(order.id, "courier"), 7000);
  setTimeout(() => advanceOrder(order.id, "complete"), 12000);
  return { ok: true as const, order };
}

export function advanceOrder(orderId: string, step: string) {
  const order = state().orders.find((o) => o.id === orderId);
  if (!order) return null;
  const now = new Date().toISOString();
  order.timeline.forEach((t) => {
    if (t.key === step) {
      t.status = step === "complete" ? "Completed" : "On Transit";
      t.at = now;
    }
  });
  if (step === "complete") {
    order.status = "DELIVERED";
    order.tab = "Delivered";
  } else {
    order.status = "PROCESSING";
    order.tab = "Processing";
  }
  pushEvent("order.advance", { orderId, step, status: order.status });
  return order;
}

export function listOrders(tab?: string | null) {
  const list = state().orders.slice();
  if (tab && tab !== "All") return list.filter((o) => o.tab === tab);
  return list;
}

export function getOrder(id: string) {
  return state().orders.find((o) => o.id === id || o.orderNumber === id) || null;
}

export function leaveReview(orderId: string, productId: string, rating: number, text = "") {
  const key = `${orderId}:${productId}`;
  state().reviews[key] = { rating, text, at: new Date().toISOString() };
  pushEvent("review.create", { orderId, productId, rating });
  return state().reviews[key];
}

export function toggleFavorite(productId: string) {
  const s = state();
  const i = s.favorites.indexOf(productId);
  if (i >= 0) s.favorites.splice(i, 1);
  else s.favorites.push(productId);
  pushEvent("favorite.toggle", { productId });
  return s.favorites.slice();
}

export function listFavorites() {
  return state().favorites.slice();
}

export function listCollections() {
  return [
    { id: "col_staples", name: "Swallow & Staples", count: 4, images: ["/img/products/pounded-yam-flour.jpg", "/img/products/fufu-flour.jpg", "/img/products/gari-white.jpg", "/img/products/jollof-rice.jpg"] },
    { id: "col_spices", name: "Spices & Soups", count: 3, images: ["/img/products/egusi-seeds.jpg", "/img/products/suya-spice.jpg", "/img/products/red-palm-oil.jpg", "/img/products/stockfish.jpg"] },
    { id: "col_snacks", name: "Snacks", count: 2, images: ["/img/products/plantain-chips.jpg", "/img/products/chin-chin.jpg", "/img/products/ripe-plantains.jpg", "/img/products/zobo-leaves.jpg"] },
  ];
}

export function getMonitor() {
  const s = state();
  const t = totals();
  return {
    healthy: true,
    build: "next-commerce-memory-v1",
    at: new Date().toISOString(),
    stats: {
      products: PRODUCTS.length,
      categories: CATEGORIES.length,
      cartItems: t.itemCount,
      cartTotalCents: t.totalCents,
      orders: s.orders.length,
      processing: s.orders.filter((o) => o.tab === "Processing").length,
      delivered: s.orders.filter((o) => o.tab === "Delivered").length,
      canceled: s.orders.filter((o) => o.tab === "Canceled").length,
      couponsClaimed: s.coupons.filter((c) => c.claimed).length,
      favorites: s.favorites.length,
    },
    recentOrders: s.orders.slice(0, 10),
    events: s.events.slice(0, 50),
  };
}
