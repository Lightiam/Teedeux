import { NextResponse } from "next/server";
import { estimateShippingRates } from "@/lib/shipping";
import type { Address, CartItem } from "@/lib/types";

/**
 * POST /api/shipping/rate
 * Mock Shippo/EasyPost rate shopping. Swap body handling for live API keys.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      items: CartItem[];
      toAddress: Address;
      fromState?: string;
    };

    if (!body?.items?.length || !body?.toAddress) {
      return NextResponse.json(
        { error: "items and toAddress are required" },
        { status: 400 }
      );
    }

    const rates = estimateShippingRates(
      body.items,
      body.toAddress,
      body.fromState ?? "TX"
    );

    return NextResponse.json({ rates });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
