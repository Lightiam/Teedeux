import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { PickingUI } from "@/components/shopper/picking-ui";
import { DEMO_SHOPPER_ORDER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Shopper Picking",
  description:
    "In-store picking checklist with out-of-stock substitution workflow.",
};

export default async function ShopperOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = {
    ...DEMO_SHOPPER_ORDER,
    orderNumber: id.startsWith("TDX") ? id : DEMO_SHOPPER_ORDER.orderNumber,
  };

  return (
    <div className="min-h-dvh pb-24">
      <AppHeader title="Shopper" subtitle="Batch acceptance · in-store pick" />
      <main className="mx-auto max-w-container-max px-margin-mobile py-6 md:px-margin-desktop md:py-8">
        <PickingUI order={order} />
      </main>
    </div>
  );
}
