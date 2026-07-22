import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import * as bcrypt from "bcryptjs";
import type { Role } from "./rbac";
import { SUPER_ADMIN_EMAIL, isAdminRole } from "./rbac";
import { hasDatabaseUrl, prisma } from "./prisma";
import {
  ensureMemorySeed,
  findMemoryUserByEmail,
  findMemoryUserById,
  type MemoryUser,
} from "./users-memory";

const COOKIE = "teedeux_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "teedeux-dev-secret-change-in-production"
);

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  isActive: boolean;
};

async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function setSessionCookie(user: SessionUser) {
  const token = await signSession(user);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const id = String(payload.sub ?? "");
    if (!id) return null;

    if (hasDatabaseUrl()) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user || !user.isActive) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
        isActive: user.isActive,
      };
    }

    ensureMemorySeed();
    const mem = findMemoryUserById(id);
    if (!mem || !mem.isActive) return null;
    return {
      id: mem.id,
      email: mem.email,
      name: mem.name,
      role: mem.role,
      isActive: mem.isActive,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !isAdminRole(user.role)) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export async function authenticate(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const normalized = email.trim().toLowerCase();

  if (hasDatabaseUrl()) {
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user || !user.isActive) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      isActive: user.isActive,
    };
  }

  ensureMemorySeed();
  const mem = findMemoryUserByEmail(normalized);
  if (!mem || !mem.isActive) return null;
  const ok = await bcrypt.compare(password, mem.passwordHash);
  if (!ok) return null;
  return {
    id: mem.id,
    email: mem.email,
    name: mem.name,
    role: mem.role,
    isActive: mem.isActive,
  };
}

export function toPublicUser(u: SessionUser | MemoryUser) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    isActive: u.isActive,
  };
}

export { SUPER_ADMIN_EMAIL };
