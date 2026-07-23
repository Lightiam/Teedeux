import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, LogOut, Package, Users } from "lucide-react";
import { getSessionUser, clearSessionCookie } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user || !isAdminRole(user.role)) {
    redirect("/login?next=/admin/products&error=unauthorized");
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-container-max items-center justify-between gap-4 px-margin-mobile py-3 md:px-margin-desktop">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-xl font-extrabold text-primary">
              Teedeux
            </Link>
            <nav className="flex gap-1 text-sm font-medium">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <LayoutDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <Package className="h-4 w-4" />
                Products
              </Link>
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name || "Admin"}</p>
              <p className="font-mono text-label-sm text-on-surface-variant">
                {user.role.replace("_", " ")} · {user.email}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await clearSessionCookie();
                redirect("/login");
              }}
            >
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-outline-variant px-3 text-sm font-semibold hover:bg-surface-container"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
        {children}
      </main>
    </div>
  );
}
