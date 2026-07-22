import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth";
import { ALL_ROLES, canAssignRole, type Role } from "@/lib/rbac";
import { createUser, listUsers } from "@/lib/users-service";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const result = await listUsers({
      q: searchParams.get("q") ?? undefined,
      role: searchParams.get("role") ?? undefined,
      active: searchParams.get("active") ?? undefined,
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
    });
    return NextResponse.json(result);
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: err.status || 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireAdmin();
    const body = (await request.json()) as {
      email?: string;
      name?: string;
      password?: string;
      role?: Role;
      phone?: string;
    };

    if (!body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: "email, password, and role are required" },
        { status: 400 }
      );
    }
    if (!ALL_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (!canAssignRole(actor.role, actor.email, body.role)) {
      return NextResponse.json(
        { error: "You cannot assign this role" },
        { status: 403 }
      );
    }

    const user = await createUser({
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role,
      phone: body.phone,
      actorId: actor.id,
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    const err = e as Error & { status?: number; code?: string };
    const status =
      err instanceof AuthError
        ? err.status
        : err.message?.includes("already")
          ? 409
          : 500;
    return NextResponse.json(
      { error: err.message || "Failed to create user" },
      { status }
    );
  }
}
