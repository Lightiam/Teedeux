import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { isAdminRole } from "@/lib/rbac";
import { UsersAdminPanel } from "@/components/admin/users-admin-panel";
import type { Role } from "@/lib/rbac";

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user || !isAdminRole(user.role)) {
    redirect("/login?next=/admin/users&error=unauthorized");
  }

  return (
    <UsersAdminPanel
      me={{
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      }}
    />
  );
}
