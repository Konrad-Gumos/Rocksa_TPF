import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dialog, DialogContent } from "@rocksa/ui";
import { type Specimen } from "@rocksa/domain";
import { ChevronIcon, CloseIcon } from "./Icons.tsx";
import { ProductDetail } from "./ProductDetail.tsx";
import { restoreListingScroll } from "../lib/listing-scroll.ts";
import { EASE } from "../lib/motion.ts";
import type { ListingSearch } from "../lib/listing-search.ts";

const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

interface Props {
  specimen: Specimen;
  category: string;
  related: Specimen[];
  listingSearch?: ListingSearch;
  modalSlugs?: string[];
  modalReturnTo?: "/";
  position: number;
  total: number;
  prev?: Specimen;
  next?: Specimen;
  background: ReactNode;
}

export const ProductModal = ({
  specimen,
  category,
  related,
  listingSearch,
  modalSlugs,
  modalReturnTo,
  position,
  total,
  prev,
  next,
  background,
}: Props) => {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [direction, setDirection] = useState(0);

  const close = () => {
    restoreListingScroll();
    if (modalReturnTo === "/") {
      navigate({ to: "/" });
      return;
    }
    navigate({
      to: "/c/$category",
      params: { category },
      search: listingSearch ?? {},
    });
  };

  const openSlug = useCallback(
    (target: Specimen, dir: -1 | 1) => {
      setDirection(dir);
      navigate({
        to: "/c/$category/p/$slug",
        params: { category, slug: target.slug },
        search: { modal: true },
        state: { listingSearch, modalSlugs, modalReturnTo },
      });
    },
    [navigate, category, listingSearch, modalSlugs, modalReturnTo],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && prev) {
        e.preventDefault();
        openSlug(prev, -1);
      } else if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        openSlug(next, 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, openSlug]);

  const slideX = direction === 0 ? 0 : direction > 0 ? 28 : -28;

  return (
    <>
      {background}
      <Dialog open onOpenChange={(open) => !open && close()}>
        <DialogContent className="flex max-h-[92vh] w-[min(96vw,72rem)] flex-col overflow-hidden p-0">
          <header className="flex shrink-0 items-center gap-4 border-b border-ink-700/5 bg-white px-5 py-3">
            <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm text-ink-500">
              <Link to="/" className="shrink-0 text-brand-600 hover:underline" onClick={close}>
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link
                to="/c/$category"
                params={{ category }}
                search={listingSearch ?? {}}
                className="shrink-0 text-brand-600 hover:underline"
                onClick={close}
              >
                {titleCase(category)}
              </Link>
              <span aria-hidden>/</span>
              <span className="truncate text-ink-900">{specimen.name}</span>
            </nav>
            {total > 1 && (
              <p className="hidden shrink-0 text-xs tabular-nums text-ink-500 sm:block">
                {position} of {total}
              </p>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-ink-700 hover:bg-ink-700/10"
            >
              <CloseIcon />
            </button>
          </header>

          <div className="overflow-y-auto px-5 py-6 lg:px-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={specimen.id}
                custom={direction}
                initial={reduce ? false : { opacity: 0, x: slideX || 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? undefined
                    : {
                        opacity: 0,
                        x: slideX ? -slideX : -12,
                        filter: "blur(4px)",
                      }
                }
                transition={{ duration: 0.32, ease: EASE }}
                onAnimationComplete={() => setDirection(0)}
              >
                <ProductDetail
                  specimen={specimen}
                  category={category}
                  related={related}
                  listingSearch={listingSearch}
                  compact
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-ink-700/5 bg-surface-muted px-5 py-3 text-sm">
              <ButtonNav
                disabled={!prev}
                onClick={() => prev && openSlug(prev, -1)}
                direction="prev"
              >
                {prev ? prev.name : "Previous"}
              </ButtonNav>
              <span className="text-xs tabular-nums text-ink-500 sm:hidden">
                {position} / {total}
              </span>
              <ButtonNav
                disabled={!next}
                onClick={() => next && openSlug(next, 1)}
                direction="next"
              >
                {next ? next.name : "Next"}
              </ButtonNav>
            </footer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const ButtonNav = ({
  children,
  disabled,
  onClick,
  direction,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
  direction: "prev" | "next";
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={
      "inline-flex max-w-[45%] items-center gap-1.5 truncate rounded-md px-3 py-2 text-brand-600 transition hover:bg-brand-50 disabled:pointer-events-none disabled:opacity-40 " +
      (direction === "next" ? "ml-auto flex-row-reverse text-right" : "")
    }
  >
    <ChevronIcon className={"h-4 w-4 shrink-0 " + (direction === "prev" ? "rotate-180" : "")} />
    <span className="truncate">{children}</span>
  </button>
);
