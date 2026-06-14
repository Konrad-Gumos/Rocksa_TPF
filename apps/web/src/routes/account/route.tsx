import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { RequireAuth } from "@rocksa/auth";
import { TopNav } from "../../components/TopNav.tsx";
import { AccountSidebar } from "../../components/AccountSidebar.tsx";
import { defaultTransition, fadeUp } from "../../lib/motion.ts";

export const Route = createFileRoute("/account")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "anon") throw redirect({ to: "/auth/login" });
  },
  component: () => (
    <RequireAuth>
      <AccountLayout />
    </RequireAuth>
  ),
});

function AccountLayout() {
  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex">
        <AccountSidebar />
        <motion.div
          className="min-w-0 flex-1"
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ ...defaultTransition, delay: reduce ? 0 : 0.06 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
