"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  Search,
  Shield,
  UserX,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ALL_ROLES,
  ROLE_LABELS,
  SUPER_ADMIN_EMAIL,
  type Role,
} from "@/lib/rbac";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

type Me = { id: string; email: string; role: Role; name: string | null };

const roleTone: Record<Role, "primary" | "secondary" | "tertiary" | "muted" | "danger"> = {
  SUPER_ADMIN: "danger",
  ADMIN: "primary",
  VENDOR: "tertiary",
  SHOPPER: "secondary",
  CUSTOMER: "muted",
};

export function UsersAdminPanel({ me }: { me: Me }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("ALL");
  const [active, setActive] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (role !== "ALL") params.set("role", role);
      if (active !== "ALL") params.set("active", active === "ACTIVE" ? "true" : "false");
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users");
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [q, role, active]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  const assignableRoles = useMemo(() => {
    if (me.role === "SUPER_ADMIN") return ALL_ROLES;
    return ALL_ROLES.filter((r) => r !== "SUPER_ADMIN");
  }, [me.role]);

  async function onDeactivate(user: UserRow) {
    if (user.email === SUPER_ADMIN_EMAIL) {
      alert("Cannot deactivate the root Super Admin.");
      return;
    }
    if (!confirm(`Deactivate ${user.email}?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface">
            User management
          </h1>
          <p className="mt-1 text-on-surface-variant">
            {total} users · RBAC for Teedeux marketplace (AfroConnect-style ops)
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4">
        <label className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-lg border-0 bg-savanna-sand/80 py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg bg-savanna-sand/80 px-3 py-2.5 outline-none"
        >
          <option value="ALL">All roles</option>
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          value={active}
          onChange={(e) => setActive(e.target.value)}
          className="rounded-lg bg-savanna-sand/80 px-3 py-2.5 outline-none"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {error ? (
        <p className="rounded-xl bg-error-container px-4 py-3 text-on-error-container">
          {error}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface-container-lowest">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-outline-variant/40 bg-surface-container font-mono text-label-sm uppercase text-on-surface-variant">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-outline-variant/25 last:border-0"
                >
                  <td className="px-4 py-3 font-semibold">{u.name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge tone={roleTone[u.role]}>{ROLE_LABELS[u.role]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.isActive ? "secondary" : "danger"}>
                      {u.isActive ? "Active" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditUser(u)}
                        title="Edit role"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Role
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-error"
                        disabled={u.email === SUPER_ADMIN_EMAIL || !u.isActive}
                        onClick={() => onDeactivate(u)}
                      >
                        <UserX className="h-3.5 w-3.5" />
                        Suspend
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {addOpen ? (
        <UserFormModal
          title="Add user"
          roles={assignableRoles}
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            const res = await fetch("/api/admin/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setAddOpen(false);
            await load();
          }}
        />
      ) : null}

      {editUser ? (
        <RoleModal
          user={editUser}
          roles={assignableRoles}
          onClose={() => setEditUser(null)}
          onSubmit={async (nextRole) => {
            const res = await fetch(`/api/admin/users/${editUser.id}/role`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role: nextRole }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setEditUser(null);
            await load();
          }}
        />
      ) : null}
    </div>
  );
}

function UserFormModal({
  title,
  roles,
  onClose,
  onSubmit,
}: {
  title: string;
  roles: Role[];
  onClose: () => void;
  onSubmit: (payload: {
    email: string;
    name: string;
    password: string;
    role: Role;
  }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(roles[0] ?? "CUSTOMER");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <ModalShell title={title} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            await onSubmit({ email, name, password, role });
          } catch (ex) {
            setErr((ex as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Field label="Name" value={name} onChange={setName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field
          label="Temporary password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <label className="block">
          <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
            Role
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg bg-savanna-sand/80 px-3 py-2.5"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </label>
        {err ? <p className="text-sm text-error">{err}</p> : null}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            <Shield className="h-4 w-4" />
            {busy ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

function RoleModal({
  user,
  roles,
  onClose,
  onSubmit,
}: {
  user: UserRow;
  roles: Role[];
  onClose: () => void;
  onSubmit: (role: Role) => Promise<void>;
}) {
  const [role, setRole] = useState<Role>(user.role);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const locked = user.email === SUPER_ADMIN_EMAIL;

  return (
    <ModalShell title={`Edit role · ${user.email}`} onClose={onClose}>
      {locked ? (
        <p className="mb-3 rounded-lg bg-error-container/60 px-3 py-2 text-sm text-on-error-container">
          Root Super Admin role is immutable for {SUPER_ADMIN_EMAIL}.
        </p>
      ) : null}
      <label className="block">
        <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
          Role
        </span>
        <select
          value={role}
          disabled={locked}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-lg bg-savanna-sand/80 px-3 py-2.5 disabled:opacity-60"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </label>
      {err ? <p className="mt-2 text-sm text-error">{err}</p> : null}
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={locked || busy}
          onClick={async () => {
            setBusy(true);
            setErr(null);
            try {
              await onSubmit(role);
            } catch (ex) {
              setErr((ex as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Saving…" : "Save role"}
        </Button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface-container-lowest p-5 shadow-warm-lg animate-fade-up">
        <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-label-sm text-on-surface-variant">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-0 border-b-2 border-transparent bg-savanna-sand/80 px-3 py-2.5 outline-none focus:border-primary"
      />
    </label>
  );
}
