import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@rocksa/ui";
import { CloseIcon } from "./Icons.tsx";

const LINKS = [
  { label: "Collections", to: "/" as const },
  { label: "Crystals", to: "/c/$category" as const, params: { category: "crystals" } },
  { label: "Journal", to: "/journal" as const },
  { label: "Investment", to: "/investment" as const },
  { label: "Custom Design", to: "/custom-design" as const },
  { label: "Cart", to: "/cart" as const },
] as const;

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-ink-900/40" onClick={() => setOpen(false)}>
          <nav
            className="absolute left-0 top-0 h-full w-72 bg-surface-muted p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl text-brand-600">Rocksa</span>
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <ul className="mt-8 space-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    {...("params" in link ? { params: link.params } : {})}
                    className="block rounded-md px-3 py-2 text-sm text-ink-900 hover:bg-brand-50"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};
