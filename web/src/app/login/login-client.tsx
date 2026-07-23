"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SUPER_ADMIN_EMAIL } from "@/lib/rbac";

export default function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/products";
  const unauthorized = params.get("error") === "unauthorized";

  const [email, setEmail] = useState(SUPER_ADMIN_EMAIL);
  const [password, setPassword] = useState("ChangeMeImmediately123!");
  const [error, setError] = useState<string | null>(
    unauthorized
      ? "Admin access required. Sign in with an ADMIN or SUPER_ADMIN account."
      : null
  );
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-warm-lg">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold text-primary"
        >
          Teedeux
        </Link>
        <h1 className="mt-4 font-display text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Admin console & marketplace accounts
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Login failed");
              const role = data.user?.role as string;
              if (
                next.startsWith("/admin") &&
                role !== "SUPER_ADMIN" &&
                role !== "ADMIN"
              ) {
                setError(
                  "This account is not authorized for the admin console."
                );
                return;
              }
              router.push(next);
              router.refresh();
            } catch (ex) {
              setError((ex as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="block">
            <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-savanna-sand/80 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-savanna-sand/80 px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-5 rounded-xl bg-surface-container p-3 font-mono text-label-sm text-on-surface-variant">
          Demo Super Admin: {SUPER_ADMIN_EMAIL}
          <br />
          Password: ChangeMeImmediately123!
        </div>
      </div>
    </div>
  );
}
