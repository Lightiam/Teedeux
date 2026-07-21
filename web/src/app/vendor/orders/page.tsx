import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { VendorOrdersFulfillment } from "@/components/vendor/orders-fulfillment";
import { DEMO_INVENTORY, DEMO_VENDOR_ORDERS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Vendor Orders",
  description:
    "Vendor fulfillment center with shipping label generation and inventory editor.",
};

export default function VendorOrdersPage() {
  return (
    <div className="min-h-dvh pb-16">
      <AppHeader title="Vendor portal" subtitle="Mama Jones · Nile Spice" />
      <main className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
        <VendorOrdersFulfillment
          initialOrders={DEMO_VENDOR_ORDERS}
          inventory={DEMO_INVENTORY}
        />
      </main>
    </div>
  );
}
