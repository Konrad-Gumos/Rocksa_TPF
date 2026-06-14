import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@rocksa/auth";
import { DiamondIcon, DocIcon } from "./Icons.tsx";

const LINKS = [
  { label: "Account", to: "/account" as const },
  { label: "Orders", to: "/account/orders" as const },
  { label: "Addresses", to: "/account/addresses" as const },
  { label: "My Collection", to: "/account/collection" as const },
] as const;

export const AccountSidebar = () => {
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  return (
    <aside className="w-60 shrink-0 border-r border-ink-700/5 bg-surface-muted p-6">
      <div className="mb-8">
        <p className="font-display text-xl text-ink-900">Your Account</p>
        <p className="mt-1 text-xs text-ink-500">
          {profile?.fullName ?? user?.displayName ?? user?.email}
        </p>
      </div>
      <nav className="space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                (active ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-brand-50")
              }
            >
              <DocIcon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => void signOut()}
        className="mt-8 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-500 hover:bg-brand-50"
      >
        <DiamondIcon className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
};
