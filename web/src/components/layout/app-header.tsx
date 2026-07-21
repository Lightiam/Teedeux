import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/checkout", label: "Checkout" },
  { href: "/vendor/orders", label: "Vendor" },
  { href: "/shopper/order/TDX-10490", label: "Shopper" },
];

export function AppHeader({
  title,
  subtitle,
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-outline-variant/40 bg-background/85 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex max-w-container-max items-center justify-between gap-4 px-margin-mobile py-3 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary transition-opacity hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-warm">
              <ShoppingBasket className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Teedeux
            </span>
          </Link>
          {title ? (
            <div className="hidden min-w-0 border-l border-outline-variant/50 pl-3 sm:block">
              <p className="truncate font-display text-lg font-semibold text-on-surface">
                {title}
              </p>
              {subtitle ? (
                <p className="truncate font-mono text-label-sm text-on-surface-variant">
                  {subtitle}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface sm:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
