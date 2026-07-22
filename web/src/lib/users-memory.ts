import * as bcrypt from "bcryptjs";
import { SUPER_ADMIN_EMAIL, type Role } from "./rbac";

export type MemoryUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MemoryAudit = {
  id: string;
  userId: string;
  action: string;
  targetId: string | null;
  details: string | null;
  createdAt: string;
};

type Store = {
  users: MemoryUser[];
  audits: MemoryAudit[];
  seeded: boolean;
};

const g = globalThis as unknown as { __teedeuxMem?: Store };

function store(): Store {
  if (!g.__teedeuxMem) {
    g.__teedeuxMem = { users: [], audits: [], seeded: false };
  }
  return g.__teedeuxMem;
}

function cuid() {
  return `mem_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ensureMemorySeed() {
  const s = store();
  if (s.seeded) return;
  s.seeded = true;
  const now = new Date().toISOString();
  const hash = bcrypt.hashSync("ChangeMeImmediately123!", 10);
  s.users.push({
    id: "user_super_admin",
    email: SUPER_ADMIN_EMAIL,
    name: "Teedeux Super Admin",
    phone: null,
    passwordHash: hash,
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  s.users.push({
    id: "user_admin_demo",
    email: "admin@teedeux.com",
    name: "Platform Admin",
    phone: null,
    passwordHash: bcrypt.hashSync("admin-demo-1234", 10),
    role: "ADMIN",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  s.users.push({
    id: "user_vendor_demo",
    email: "vendor@mama-jones.teedeux",
    name: "Mama Jones",
    phone: "+1 (404) 555-0100",
    passwordHash: bcrypt.hashSync("vendor-demo-1234", 10),
    role: "VENDOR",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  s.users.push({
    id: "user_shopper_demo",
    email: "shopper@teedeux.com",
    name: "Kwame Mensah",
    phone: null,
    passwordHash: bcrypt.hashSync("shopper-demo-1234", 10),
    role: "SHOPPER",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
  s.users.push({
    id: "user_customer_demo",
    email: "ada@teedeux.com",
    name: "Ada Okonkwo",
    phone: null,
    passwordHash: bcrypt.hashSync("customer-demo-1234", 10),
    role: "CUSTOMER",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });
}

export function listMemoryUsers(opts?: {
  q?: string;
  role?: string;
  active?: string;
}) {
  ensureMemorySeed();
  let rows = [...store().users];
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    rows = rows.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q)
    );
  }
  if (opts?.role && opts.role !== "ALL") {
    rows = rows.filter((u) => u.role === opts.role);
  }
  if (opts?.active === "true") rows = rows.filter((u) => u.isActive);
  if (opts?.active === "false") rows = rows.filter((u) => !u.isActive);
  return rows.sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function findMemoryUserByEmail(email: string) {
  ensureMemorySeed();
  return store().users.find((u) => u.email === email.toLowerCase()) ?? null;
}

export function findMemoryUserById(id: string) {
  ensureMemorySeed();
  return store().users.find((u) => u.id === id) ?? null;
}

export function createMemoryUser(input: {
  email: string;
  name?: string;
  password: string;
  role: Role;
  phone?: string;
}): MemoryUser {
  ensureMemorySeed();
  const email = input.email.trim().toLowerCase();
  if (findMemoryUserByEmail(email)) {
    throw new Error("Email already registered");
  }
  const now = new Date().toISOString();
  const user: MemoryUser = {
    id: cuid(),
    email,
    name: input.name?.trim() || null,
    phone: input.phone?.trim() || null,
    passwordHash: bcrypt.hashSync(input.password, 10),
    role: input.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  store().users.unshift(user);
  return user;
}

export function updateMemoryUserRole(id: string, role: Role): MemoryUser {
  const user = findMemoryUserById(id);
  if (!user) throw new Error("User not found");
  user.role = role;
  user.updatedAt = new Date().toISOString();
  return user;
}

export function deactivateMemoryUser(id: string): MemoryUser {
  const user = findMemoryUserById(id);
  if (!user) throw new Error("User not found");
  user.isActive = false;
  user.updatedAt = new Date().toISOString();
  return user;
}

export function addMemoryAudit(entry: {
  userId: string;
  action: string;
  targetId?: string | null;
  details?: string | null;
}) {
  ensureMemorySeed();
  store().audits.unshift({
    id: cuid(),
    userId: entry.userId,
    action: entry.action,
    targetId: entry.targetId ?? null,
    details: entry.details ?? null,
    createdAt: new Date().toISOString(),
  });
}

export function listMemoryAudits(limit = 50) {
  ensureMemorySeed();
  return store().audits.slice(0, limit);
}
