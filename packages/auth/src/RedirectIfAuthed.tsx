import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./AuthProvider.tsx";
import { defaultRouteForRole } from "./routes.ts";

interface Props {
  redirectTo?: "/" | "/workspace/overview";
  children: ReactNode;
}

export const RedirectIfAuthed = ({ redirectTo, children }: Props) => {
  const { status, profile } = useAuth();
  if (status === "loading") return null;
  if (status === "authed") {
    const dest = redirectTo ?? (profile ? defaultRouteForRole(profile.role) : "/");
    return <Navigate to={dest} />;
  }
  return <>{children}</>;
};
