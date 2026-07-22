import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function hasDatabaseUrl(): boolean {
  if (process.env.TEEDEUX_USE_MEMORY === "1") return false;
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  // Ignore Prisma init placeholders — fall back to in-memory RBAC demo
  if (
    url.includes("johndoe:") ||
    url.includes("USER:PASSWORD") ||
    url.includes("localhost:5432/mydb")
  ) {
    return false;
  }
  return true;
}

/** Lazily construct Prisma only when a real DATABASE_URL is configured. */
export function getPrisma(): PrismaClient {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL not configured for Prisma");
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

/** @deprecated Prefer getPrisma() — kept for call-site compatibility */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
