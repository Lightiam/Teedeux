/** Teedeux RBAC helpers — Super Admin: teedeux.dev@gmail.com */

export const SUPER_ADMIN_EMAIL = "teedeux.dev@gmail.com";

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "VENDOR"
  | "SHOPPER"
  | "CUSTOMER";

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN"];

export const ALL_ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "VENDOR",
  "SHOPPER",
  "CUSTOMER",
];

export function isAdminRole(role: Role | string | undefined | null): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function isSuperAdminEmail(email: string | undefined | null): boolean {
  return (email ?? "").trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

export function canAssignRole(
  actorRole: Role,
  actorEmail: string,
  targetRole: Role
): boolean {
  if (actorRole === "SUPER_ADMIN") return true;
  if (actorRole === "ADMIN") {
    // Admins cannot create/promote SUPER_ADMIN
    return targetRole !== "SUPER_ADMIN";
  }
  return false;
}

export function canModifyUser(
  actor: { role: Role; email: string; id: string },
  target: { role: Role; email: string; id: string }
): { ok: boolean; reason?: string } {
  if (isSuperAdminEmail(target.email)) {
    if (!isSuperAdminEmail(actor.email)) {
      return {
        ok: false,
        reason: "Cannot modify the root Super Admin account.",
      };
    }
  }
  if (target.role === "SUPER_ADMIN" && actor.role !== "SUPER_ADMIN") {
    return { ok: false, reason: "Only Super Admins can modify Super Admins." };
  }
  if (actor.id === target.id && actor.role === "SUPER_ADMIN") {
    // allow self profile edits elsewhere; block self-downgrade via role APIs
  }
  return { ok: true };
}

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  VENDOR: "Vendor",
  SHOPPER: "Shopper",
  CUSTOMER: "Customer",
};
