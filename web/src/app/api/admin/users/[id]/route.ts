import { NextResponse } from "next/server";
import { AuthError, requireAdmin } from "@/lib/auth";
import { canModifyUser } from "@/lib/rbac";
import { deactivateUser, getUserById } from "@/lib/users-service";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await requireAdmin();
    const { id } = await context.params;
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

    const user = await deactivateUser({ id, actorId: actor.id });
    return NextResponse.json({ user });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Failed to deactivate user" },
      { status: err.status || 400 }
    );
  }
}
