import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RequireAuth } from "@rocksa/auth";
import { TopNav } from "../../components/TopNav.tsx";

export const Route = createFileRoute("/account")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "anon") throw redirect({ to: "/auth/login" });
  },
  component: () => (
    <RequireAuth>
      <div className="min-h-screen">
        <TopNav />
        <Outlet />
      </div>
    </RequireAuth>
  ),
});
