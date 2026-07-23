"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  size: string;
  category: string;
  priceCents: number;
  compareAtCents?: number;
  badge?: string;
  imageUrl: string;
  description: string;
};

type Category = { id: string; label: string };

const emptyForm = {
  id: "",
  name: "",
  size: "",
  category: "Staples",
  price: "",
  compareAt: "",
  badge: "",
  imageUrl: "/img/products/jollof-rice.jpg",
  description: "",
};

export function ProductsAdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load products");
    setProducts(data.products || []);
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(needle) ||
        p.id.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
      );
    });
  }, [products, q, category]);

  function select(p: Product | null) {
    if (!p) {
      setForm({ ...emptyForm, category: categories[0]?.id || "Staples" });
      return;
    }
    setForm({
      id: p.id,
      name: p.name,
      size: p.size,
      category: p.category,
      price: (p.priceCents / 100).toFixed(2),
      compareAt: p.compareAtCents ? (p.compareAtCents / 100).toFixed(2) : "",
      badge: p.badge || "",
      imageUrl: p.imageUrl,
      description: p.description,
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: {
            id: form.id || undefined,
            name: form.name,
            size: form.size,
            category: form.category,
            priceCents: Math.round(Number(form.price || 0) * 100),
            compareAtCents:
              form.compareAt === ""
                ? undefined
                : Math.round(Number(form.compareAt) * 100),
            badge: form.badge,
            imageUrl: form.imageUrl,
            description: form.description,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setProducts(data.products || []);
      select(data.product);
      setMsg(`Saved "${data.product.name}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!form.id) return;
    if (!confirm("Delete this product?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: form.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setProducts(data.products || []);
      select(data.products?.[0] || null);
      setMsg("Product deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!confirm("Reset products to the default African grocery catalog?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setProducts(data.products || []);
      select(data.products?.[0] || null);
      setMsg("Catalog reset to defaults.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          className="min-w-[180px] flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <Button type="button" onClick={() => select(null)}>
          New product
        </Button>
        <Button type="button" variant="outline" onClick={reset} disabled={busy}>
          Reset defaults
        </Button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {msg && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="max-h-[70vh] space-y-2 overflow-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-3">
          <p className="px-1 text-sm font-semibold text-on-surface-variant">
            {filtered.length} products
          </p>
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => select(p)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                form.id === p.id
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/40 hover:bg-surface-container"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt=""
                className="h-12 w-12 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{p.name}</span>
                <span className="block truncate text-xs text-on-surface-variant">
                  {p.category} · {p.size}
                </span>
              </span>
              <span className="font-bold text-primary">
                ${(p.priceCents / 100).toFixed(2)}
              </span>
            </button>
          ))}
        </div>

        <form
          onSubmit={save}
          className="space-y-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4"
        >
          <h2 className="font-display text-xl font-bold">
            {form.id ? "Edit product" : "New product"}
          </h2>
          <label className="block text-sm">
            <span className="mb-1 block text-on-surface-variant">Name</span>
            <input
              required
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-on-surface-variant">Size</span>
              <input
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-on-surface-variant">Category</span>
              <select
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block text-on-surface-variant">Price (USD)</span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-on-surface-variant">Compare-at</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-outline-variant px-3 py-2"
                value={form.compareAt}
                onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-on-surface-variant">Badge</span>
            <input
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-on-surface-variant">Image URL</span>
            <input
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-on-surface-variant">Description</span>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-outline-variant px-3 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={busy}>
              Save product
            </Button>
            {form.id ? (
              <Button type="button" variant="outline" onClick={remove} disabled={busy}>
                Delete
              </Button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
