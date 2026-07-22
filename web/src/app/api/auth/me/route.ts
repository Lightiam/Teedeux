import { NextResponse } from "next/server";
import { getSessionUser, toPublicUser } from "@/lib/auth";
import { hasDatabaseUrl } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null, mode: hasDatabaseUrl() ? "db" : "memory" });
  }
  return NextResponse.json({
    user: toPublicUser(user),
    mode: hasDatabaseUrl() ? "db" : "memory",
  });
}
