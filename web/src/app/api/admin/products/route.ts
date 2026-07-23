import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth";
import {
  deleteProduct,
  listCategories,
  listProducts,
  resetProducts,
  upsertProduct,
} from "@/lib/commerce-memory";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    return NextResponse.json({
      products: listProducts({
        category: searchParams.get("category") || undefined,
        q: searchParams.get("q") || undefined,
      }),
      categories: listCategories(),
    });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: err.status || 401 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      action?: string;
      product?: Record<string, unknown>;
      id?: string;
    };

    if (body.action === "reset") {
      return NextResponse.json({ products: resetProducts() });
    }

    if (body.action === "delete") {
      const id = String(body.id || "");
      if (!id) {
        return NextResponse.json({ error: "id required" }, { status: 400 });
      }
      const ok = deleteProduct(id);
      if (!ok) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, products: listProducts() });
    }

    const product = upsertProduct({
      id: body.product?.id as string | undefined,
      name: body.product?.name as string | undefined,
      size: body.product?.size as string | undefined,
      category: body.product?.category as string | undefined,
      priceCents: body.product?.priceCents as number | undefined,
      compareAtCents: body.product?.compareAtCents as number | undefined,
      badge: body.product?.badge as string | undefined,
      imageUrl: body.product?.imageUrl as string | undefined,
      description: body.product?.description as string | undefined,
    });
    return NextResponse.json({ product, products: listProducts() });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: err.status || 401 },
    );
  }
}
