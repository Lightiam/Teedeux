import { Suspense } from "react";
import LoginClient from "./login-client";

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
