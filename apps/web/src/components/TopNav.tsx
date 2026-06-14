import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, Input } from "@rocksa/ui";
import { useAuth } from "@rocksa/auth";
import { BellIcon, CartIcon, HelpIcon, SearchIcon } from "./Icons.tsx";
import { useCartCount } from "@rocksa/cart";
import { MobileNav } from "./MobileNav.tsx";
import { defaultTransition } from "../lib/motion.ts";
import { stickyTopNavClassName, topNavInnerClassName } from "../lib/layout.ts";
interface Props {
  variant?: "full" | "minimal";
}

export const TopNav = ({ variant = "full" }: Props) => {
  const count = useCartCount();
  const reduce = useReducedMotion();
  const { status, signOut } = useAuth();
  const navigate = useNavigate();
  const routerSearch = useRouterState({
    select: (s) => (s.location.pathname === "/search" ? s.location.search : {}),
  });
  const initialQuery =
    typeof routerSearch === "object" &&
    routerSearch !== null &&
    "q" in routerSearch &&
    typeof routerSearch.q === "string"
      ? routerSearch.q
      : "";
  const [query, setQuery] = useState(initialQuery);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate({ to: "/search", search: { q: trimmed } });
  };

  if (variant === "minimal") {
    return (
      <header className={stickyTopNavClassName}>
        <div className={`${topNavInnerClassName} justify-between`}>
          <Link to="/" className="font-display text-2xl text-brand-600">
            Rocksa
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-sm text-ink-500">
            Cancel <span aria-hidden>✕</span>
          </Link>
        </div>
      </header>
    );
  }

  const authed = status === "authed";

  return (
    <header className={stickyTopNavClassName}>
      <div className={topNavInnerClassName}>
        <Link to="/" className="shrink-0 font-display text-2xl text-brand-600">
          Rocksa
        </Link>

        <MobileNav />

        <form
          onSubmit={submitSearch}
          className="relative hidden w-full max-w-xs md:block lg:max-w-sm"
        >
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <Input
            placeholder="Search collection…"
            className="h-9 pl-10 bg-white/80 border-ink-700/5"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search collection"
          />
        </form>

        <motion.div
          className="flex-1"
          aria-hidden
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...defaultTransition, delay: 0.05 }}
        />

        <motion.nav
          className="flex shrink-0 items-center gap-2 text-brand-600"
          initial={reduce ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...defaultTransition, delay: 0.08 }}
        >
          <Link
            to="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50">
            <BellIcon />
          </button>
          <Link
            to="/journal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-50"
            aria-label="Help and journal"
          >
            <HelpIcon />
          </Link>
          {authed && (
            <Button asChild size="sm" variant="secondary" className="ml-2">
              <Link to="/account">Account</Link>
            </Button>
          )}
        </motion.nav>

        {authed ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...defaultTransition, delay: 0.1 }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="hidden shrink-0 md:inline-flex"
              onClick={async () => {
                await signOut();
                navigate({ to: "/" });
              }}
            >
              Sign Out
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...defaultTransition, delay: 0.1 }}
          >
            <Button asChild size="sm" className="hidden shrink-0 md:inline-flex">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  );
};
