import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { HybridCheckout } from "@/components/checkout/hybrid-checkout";
import { getDemoHybridCheckout } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Hybrid Checkout",
  description:
    "Split cart into local same-day delivery and nationwide shipping with dynamic fees.",
};

export default function CheckoutPage() {
  const cart = getDemoHybridCheckout();

  return (
    <div className="min-h-dvh pb-16">
      <AppHeader
        title="Final Review"
        subtitle="Local + nationwide in one checkout"
      />
      <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
        <p className="mb-6 max-w-2xl text-on-surface-variant">
          Items are automatically routed: fresh and frozen stay in your local
          lane; dry specialty goods ship from partner vendors.
        </p>
        <HybridCheckout
          initialLocalItems={cart.localItems}
          initialShippedItems={cart.shippedItems}
          initialAddress={cart.address}
          initialTipCents={cart.fees.tipCents}
        />
      </main>
    </div>
  );
}
