import { NextResponse } from "next/server";
import { mockCreateShippingLabel } from "@/lib/shipping";

/**
 * POST /api/shipping/label
 * Mock label purchase. Wire to Shippo transactions or EasyPost shipments.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderNumber: string;
      rateId: string;
      carrier: string;
    };

    if (!body?.orderNumber || !body?.rateId || !body?.carrier) {
      return NextResponse.json(
        { error: "orderNumber, rateId, and carrier are required" },
        { status: 400 }
      );
    }

    // Simulate carrier latency
    await new Promise((r) => setTimeout(r, 400));

    const label = mockCreateShippingLabel(body);
    return NextResponse.json(label);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
