"use client";

import { useCallback, useEffect, useState } from "react";

type MonitorPayload = {
  healthy: boolean;
  build: string;
  at: string;
  stats: Record<string, number | string>;
  recentOrders: Array<{
    orderNumber: string;
    tab: string;
    createdAt: string;
    totals: { totalCents: number };
    items: Array<{ name: string; quantity: number }>;
  }>;
  events: Array<{ at: string; type: string; detail: Record<string, unknown> }>;
};

function money(cents: number) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

export default function MonitorPage() {
  const [data, setData] = useState<MonitorPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/commerce/monitor", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load monitor");
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <main className="min-h-screen bg-[#0f1419] text-[#eef3f8] p-4 md:p-6 font-mono">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-sm tracking-widest uppercase">Teedeux · Environment Monitor</h1>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-3 py-1 rounded-full ${data?.healthy ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
            {data?.healthy ? `healthy · ${data.build}` : error || "degraded"}
          </span>
          <button type="button" onClick={load} className="bg-[#ff5a1f] text-white font-bold px-3 py-1.5 rounded-lg">
            Refresh
          </button>
          <a href="/" className="text-[#ff5a1f] font-bold">
            ← App
          </a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-[#2a3542] bg-[#1a222c] p-4">
          <h2 className="text-[11px] uppercase tracking-wider text-[#9aa7b5] mb-3">Live stats</h2>
          {data ? (
            Object.entries(data.stats).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-dashed border-[#2a3542] text-sm">
                <span className="text-[#9aa7b5]">{k}</span>
                <strong>{typeof v === "number" && k.toLowerCase().includes("cent") ? money(v) : String(v)}</strong>
              </div>
            ))
          ) : (
            <p className="text-[#9aa7b5] text-xs">{error || "Loading…"}</p>
          )}
        </section>

        <section className="rounded-xl border border-[#2a3542] bg-[#1a222c] p-4 max-h-[70vh] overflow-auto">
          <h2 className="text-[11px] uppercase tracking-wider text-[#9aa7b5] mb-3">Recent orders</h2>
          {data?.recentOrders?.length ? (
            data.recentOrders.map((o) => (
              <div key={o.orderNumber} className="py-3 border-b border-[#2a3542] text-xs">
                <div className="text-[#9aa7b5]">{new Date(o.createdAt).toLocaleString()}</div>
                <div>
                  <strong>{o.orderNumber}</strong> · {o.tab} · {money(o.totals.totalCents)}
                </div>
                <div className="text-[#9aa7b5]">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</div>
              </div>
            ))
          ) : (
            <p className="text-[#9aa7b5] text-xs">No orders yet.</p>
          )}
        </section>

        <section className="rounded-xl border border-[#2a3542] bg-[#1a222c] p-4 max-h-[70vh] overflow-auto">
          <h2 className="text-[11px] uppercase tracking-wider text-[#9aa7b5] mb-3">Event stream</h2>
          {data?.events?.length ? (
            data.events.map((e, idx) => (
              <div key={`${e.at}-${idx}`} className="py-3 border-b border-[#2a3542] text-xs">
                <div className="text-[#9aa7b5]">{new Date(e.at).toLocaleString()}</div>
                <div>
                  <span className="text-[#ff5a1f] font-bold">{e.type}</span> {JSON.stringify(e.detail)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#9aa7b5] text-xs">No events yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
