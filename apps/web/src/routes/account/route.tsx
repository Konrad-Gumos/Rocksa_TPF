import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RequireAuth } from "@rocksa/auth";
import { TopNav } from "../../components/TopNav.tsx";
import { AccountSidebar } from "../../components/AccountSidebar.tsx";

export const Route = createFileRoute("/account")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "anon") throw redirect({ to: "/auth/login" });
  },
  component: () => (
    <RequireAuth>
      <div className="min-h-screen">
        <TopNav />
        <div className="flex">
          <AccountSidebar />
          <Outlet />
        </div>
      </div>
    </RequireAuth>
  ),
});
