/**
 * Shared Teedeux product catalog API (Netlify Function + Blobs).
 * GET  — public read (shoppers see owner-saved products)
 * POST — Super Admin write (email + password required)
 */
import { getStore } from "@netlify/blobs";

const ADMIN_USERNAME = "teedeux.dev@gmail.com";
const ADMIN_PASSWORD = "ChangeMeImmediately123!";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });
}

function isAuthed(body) {
  const email = String(body?.email || body?.username || "")
    .trim()
    .toLowerCase();
  const password = String(body?.password || "");
  return email === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }

  const store = getStore("teedeux-catalog");

  if (req.method === "GET") {
    const products = await store.get("products", { type: "json" });
    const meta = await store.get("meta", { type: "json" });
    return json({
      ok: true,
      products: Array.isArray(products) ? products : null,
      updatedAt: meta?.updatedAt || null,
      source: products ? "blob" : "empty",
    });
  }

  if (req.method === "POST") {
    let body = {};
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON body" }, 400);
    }

    if (!isAuthed(body)) {
      return json(
        {
          ok: false,
          error: "Invalid Super Admin username or password",
          hint: {
            username: ADMIN_USERNAME,
            password: "Use the Super Admin password from the Teedeux README",
          },
        },
        401,
      );
    }

    const action = String(body.action || "save");

    if (action === "reset") {
      await store.delete("products");
      await store.setJSON("meta", {
        updatedAt: new Date().toISOString(),
        action: "reset",
      });
      return json({ ok: true, products: null, reset: true });
    }

    const products = body.products;
    if (!Array.isArray(products) || !products.length) {
      return json({ ok: false, error: "products array required" }, 400);
    }

    const cleaned = products
      .filter((p) => p && p.id && p.name)
      .map((p) => ({
        id: String(p.id),
        name: String(p.name),
        size: String(p.size || ""),
        category: String(p.category || "Staples"),
        priceCents: Number(p.priceCents) || 0,
        compareAtCents: p.compareAtCents ? Number(p.compareAtCents) : undefined,
        unitPrice: p.unitPrice || "",
        imageUrl: String(p.imageUrl || "/img/products/jollof-rice.jpg"),
        badge: p.badge || undefined,
        description: String(p.description || ""),
        shippable: !!p.shippable || !!p.shipNationwide,
        shipNationwide: !!p.shippable || !!p.shipNationwide,
      }));

    if (!cleaned.length) {
      return json({ ok: false, error: "No valid products to save" }, 400);
    }

    const updatedAt = new Date().toISOString();
    await store.setJSON("products", cleaned);
    await store.setJSON("meta", {
      updatedAt,
      count: cleaned.length,
      by: ADMIN_USERNAME,
    });

    return json({ ok: true, products: cleaned, updatedAt });
  }

  return json({ ok: false, error: "Method not allowed" }, 405);
};

export const config = {
  path: "/api/products",
};
