import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth";
import { ALL_ROLES, canAssignRole, canModifyUser, type Role } from "@/lib/rbac";
import { getUserById, updateUserRole } from "@/lib/users-service";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;
    const body = (await request.json()) as { role?: Role };
    if (!body.role || !ALL_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Valid role is required" }, { status: 400 });
    }

    const target = await getUserById(id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const gate = canModifyUser(
      { role: actor.role, email: actor.email, id: actor.id },
      { role: target.role, email: target.email, id: target.id }
    );
    if (!gate.ok) {
      return NextResponse.json({ error: gate.reason }, { status: 403 });
    }
    if (!canAssignRole(actor.role, actor.email, body.role)) {
      return NextResponse.json(
        { error: "You cannot assign this role" },
        { status: 403 }
      );
    }

    const user = await updateUserRole({
      id,
      role: body.role,
      actorId: actor.id,
    });
    return NextResponse.json({ user });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Failed to update role" },
      { status: err.status || 400 }
    );
  }
}
