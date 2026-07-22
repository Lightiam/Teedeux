import * as bcrypt from "bcryptjs";
import { hasDatabaseUrl, prisma } from "./prisma";
import {
  addMemoryAudit,
  createMemoryUser,
  deactivateMemoryUser,
  findMemoryUserById,
  listMemoryUsers,
  updateMemoryUserRole,
  type MemoryUser,
} from "./users-memory";
import type { Role } from "./rbac";
import { SUPER_ADMIN_EMAIL } from "./rbac";

export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

function mapDb(u: {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
}): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role as Role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  };
}

function mapMem(u: MemoryUser): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt,
  };
}

export async function listUsers(opts: {
  q?: string;
  role?: string;
  active?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ users: PublicUser[]; total: number }> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));

  if (!hasDatabaseUrl()) {
    const all = listMemoryUsers(opts);
    const start = (page - 1) * pageSize;
    return {
      users: all.slice(start, start + pageSize).map(mapMem),
      total: all.length,
    };
  }

  const where: Record<string, unknown> = {};
  if (opts.q) {
    where.OR = [
      { email: { contains: opts.q, mode: "insensitive" } },
      { name: { contains: opts.q, mode: "insensitive" } },
    ];
  }
  if (opts.role && opts.role !== "ALL") where.role = opts.role;
  if (opts.active === "true") where.isActive = true;
  if (opts.active === "false") where.isActive = false;

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { users: rows.map(mapDb), total };
}

export async function createUser(input: {
  email: string;
  name?: string;
  password: string;
  role: Role;
  phone?: string;
  actorId: string;
}): Promise<PublicUser> {
  if (!hasDatabaseUrl()) {
    const user = createMemoryUser(input);
    addMemoryAudit({
      userId: input.actorId,
      action: "CREATE_USER",
      targetId: user.id,
      details: `Created ${user.email} as ${user.role}`,
    });
    return mapMem(user);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email: input.email.trim().toLowerCase(),
      name: input.name?.trim() || null,
      phone: input.phone?.trim() || null,
      passwordHash,
      role: input.role,
      isActive: true,
    },
  });
  await prisma.auditLog.create({
    data: {
      userId: input.actorId,
      action: "CREATE_USER",
      targetId: user.id,
      details: `Created ${user.email} as ${user.role}`,
    },
  });
  return mapDb(user);
}

export async function updateUserRole(input: {
  id: string;
  role: Role;
  actorId: string;
}): Promise<PublicUser> {
  if (!hasDatabaseUrl()) {
    const before = findMemoryUserById(input.id);
    if (!before) throw new Error("User not found");
    if (before.email === SUPER_ADMIN_EMAIL && input.role !== "SUPER_ADMIN") {
      throw new Error("Cannot downgrade the root Super Admin.");
    }
    const user = updateMemoryUserRole(input.id, input.role);
    addMemoryAudit({
      userId: input.actorId,
      action: "PROMOTE_TO_" + input.role,
      targetId: user.id,
      details: `Role ${before.role} → ${input.role}`,
    });
    return mapMem(user);
  }

  const before = await prisma.user.findUnique({ where: { id: input.id } });
  if (!before) throw new Error("User not found");
  if (before.email === SUPER_ADMIN_EMAIL && input.role !== "SUPER_ADMIN") {
    throw new Error("Cannot downgrade the root Super Admin.");
  }
  const user = await prisma.user.update({
    where: { id: input.id },
    data: { role: input.role },
  });
  await prisma.auditLog.create({
    data: {
      userId: input.actorId,
      action: "UPDATE_ROLE",
      targetId: user.id,
      details: `Role ${before.role} → ${input.role}`,
    },
  });
  return mapDb(user);
}

export async function deactivateUser(input: {
  id: string;
  actorId: string;
}): Promise<PublicUser> {
  if (!hasDatabaseUrl()) {
    const before = findMemoryUserById(input.id);
    if (!before) throw new Error("User not found");
    if (before.email === SUPER_ADMIN_EMAIL) {
      throw new Error("Cannot deactivate the root Super Admin.");
    }
    const user = deactivateMemoryUser(input.id);
    addMemoryAudit({
      userId: input.actorId,
      action: "DELETE_USER",
      targetId: user.id,
      details: `Deactivated ${user.email}`,
    });
    return mapMem(user);
  }

  const before = await prisma.user.findUnique({ where: { id: input.id } });
  if (!before) throw new Error("User not found");
  if (before.email === SUPER_ADMIN_EMAIL) {
    throw new Error("Cannot deactivate the root Super Admin.");
  }
  const user = await prisma.user.update({
    where: { id: input.id },
    data: { isActive: false },
  });
  await prisma.auditLog.create({
    data: {
      userId: input.actorId,
      action: "DELETE_USER",
      targetId: user.id,
      details: `Deactivated ${user.email}`,
    },
  });
  return mapDb(user);
}

export async function getUserById(id: string): Promise<PublicUser | null> {
  if (!hasDatabaseUrl()) {
    const u = findMemoryUserById(id);
    return u ? mapMem(u) : null;
  }
  const u = await prisma.user.findUnique({ where: { id } });
  return u ? mapDb(u) : null;
}
