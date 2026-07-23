import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";
import { SUPER_ADMIN_EMAIL } from "@/lib/rbac";

export default async function AdminOverviewPage() {
  const user = await getSessionUser();
  const mode = hasDatabaseUrl() ? "PostgreSQL" : "In-memory demo";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin command center</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Teedeux marketplace control panel — AfroConnect-inspired African grocery
          ops with dual local delivery + nationwide shipping, secured by RBAC.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
          <p className="font-mono text-label-sm text-on-surface-variant">DATA MODE</p>
          <p className="mt-2 font-display text-xl font-bold">{mode}</p>
        </div>
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
          <p className="font-mono text-label-sm text-on-surface-variant">ROOT SUPER ADMIN</p>
          <p className="mt-2 break-all font-display text-lg font-bold text-primary">
            {SUPER_ADMIN_EMAIL}
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-5">
          <p className="font-mono text-label-sm text-on-surface-variant">SIGNED IN</p>
          <p className="mt-2 font-display text-lg font-bold">{user?.role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary shadow-warm"
        >
          Manage products
        </Link>
        <Link
          href="/admin/users"
          className="inline-flex rounded-xl border border-outline-variant px-5 py-3 font-semibold hover:bg-surface-container"
        >
          Open user management
        </Link>
      </div>
    </div>
  );
}
