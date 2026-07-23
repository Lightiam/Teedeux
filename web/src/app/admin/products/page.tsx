import { ProductsAdminPanel } from "@/components/admin/products-admin-panel";
import { SUPER_ADMIN_EMAIL } from "@/lib/rbac";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Product catalog</h1>
        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Super Admin product manager for the site owner. Update names, prices,
          images, and categories. Live Netlify shop also has{" "}
          <code className="rounded bg-surface-container px-1.5 py-0.5 text-sm">
            /admin.html
          </code>{" "}
          with the same credentials ({SUPER_ADMIN_EMAIL}).
        </p>
      </div>
      <ProductsAdminPanel />
    </div>
  );
}
