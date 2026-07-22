import { NextResponse } from "next/server";
import { AuthError, authenticate, setSessionCookie, toPublicUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    const user = await authenticate(body.email, body.password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    await setSessionCookie(user);
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json(
      { error: err.message || "Login failed" },
      { status: err.status || 500 }
    );
  }
}
