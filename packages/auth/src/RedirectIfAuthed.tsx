import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./AuthProvider.tsx";
import { defaultRouteForRole } from "./routes.ts";

const AuthLoadingShell = () => (
  <main className="flex min-h-screen items-center justify-center bg-surface-muted">
    <p className="text-sm text-ink-500">Loading session…</p>
  </main>
);

interface Props {
  redirectTo?: "/" | "/workspace/overview";
  children: ReactNode;
}

export const RedirectIfAuthed = ({ redirectTo, children }: Props) => {
  const { status, profile } = useAuth();
  if (status === "loading") return <AuthLoadingShell />;
  if (status === "authed") {
    const dest = redirectTo ?? (profile ? defaultRouteForRole(profile.role) : "/");
    return <Navigate to={dest} />;
  }
  return <>{children}</>;
};
