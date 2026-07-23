import { NextResponse } from "next/server";
import {
  getMonitor,
  listCategories,
  listProducts,
  getCart,
  addToCart,
  setQty,
  removeFromCart,
  applyPromo,
  claimCoupon,
  listCoupons,
  checkout,
  listOrders,
  getOrder,
  advanceOrder,
  leaveReview,
  toggleFavorite,
  listFavorites,
  listCollections,
  selectAddress,
  selectPayment,
  listAddresses,
  listPayments,
} from "@/lib/commerce-memory";

function ok(data: unknown, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const resource = path[0] || "health";
  const id = path[1];
  const url = new URL(request.url);

  switch (resource) {
    case "health":
    case "monitor":
      return ok(getMonitor());
    case "categories":
      return ok({ categories: listCategories() });
    case "products":
      return ok({
        products: listProducts({
          category: url.searchParams.get("category") || undefined,
          q: url.searchParams.get("q") || undefined,
        }),
      });
    case "cart":
      return ok({ cart: getCart() });
    case "coupons":
      return ok({ coupons: listCoupons() });
    case "orders":
      return ok({ orders: listOrders(url.searchParams.get("tab") || undefined) });
    case "order":
      if (!id) return err("order id required");
      return ok({ order: getOrder(id) });
    case "favorites":
      return ok({ favorites: listFavorites(), collections: listCollections() });
    case "addresses":
      return ok({ addresses: listAddresses() });
    case "payments":
      return ok({ payments: listPayments() });
    default:
      return err("Unknown commerce route", 404);
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const resource = path[0];
  const action = path[1];
  const body = await request.json().catch(() => ({}));

  switch (resource) {
    case "cart":
      if (action === "add") return ok({ cart: addToCart(body.productId, body.qty) });
      if (action === "qty") return ok({ cart: setQty(body.productId, body.qty) });
      if (action === "remove") return ok({ cart: removeFromCart(body.productId) });
      if (action === "promo") {
        const result = applyPromo(body.code);
        return result.ok ? ok(result) : err(result.error || "Invalid promo");
      }
      return err("Unknown cart action");
    case "coupons":
      if (action === "claim") {
        const result = claimCoupon(body.id || body.code);
        return result.ok ? ok(result) : err(result.error || "Invalid coupon");
      }
      return err("Unknown coupons action");
    case "checkout": {
      const result = checkout();
      return result.ok ? ok(result) : err(result.error || "Checkout failed");
    }
    case "orders":
      if (action === "advance") return ok({ order: advanceOrder(body.orderId, body.step) });
      if (action === "review")
        return ok({
          review: leaveReview(body.orderId, body.productId, body.rating, body.text),
        });
      return err("Unknown orders action");
    case "favorites":
      if (action === "toggle") return ok({ favorites: toggleFavorite(body.productId) });
      return err("Unknown favorites action");
    case "addresses":
      if (action === "select") return ok({ addresses: selectAddress(body.id) });
      return err("Unknown addresses action");
    case "payments":
      if (action === "select") return ok({ payments: selectPayment(body.id) });
      return err("Unknown payments action");
    default:
      return err("Unknown commerce route", 404);
  }
}
