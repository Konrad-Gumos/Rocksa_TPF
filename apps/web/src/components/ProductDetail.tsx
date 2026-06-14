import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@rocksa/cart";
import { Badge, Button, Card, CardBody, Separator } from "@rocksa/ui";
import { formatPrice, isPurchasable, type Specimen } from "@rocksa/domain";
import { ShareIcon, ShieldIcon } from "./Icons.tsx";
import { ProductCard } from "./ProductCard.tsx";
import { EASE } from "../lib/motion.ts";
import type { ListingSearch } from "../lib/listing-search.ts";

interface Props {
  specimen: Specimen;
  category: string;
  related: Specimen[];
  listingSearch?: ListingSearch;
  compact?: boolean;
}

export const ProductDetail = ({
  specimen,
  category,
  related,
  listingSearch,
  compact = false,
}: Props) => {
  const { add } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [reportOpen, setReportOpen] = useState(true);
  const reduce = useReducedMotion();

  const thumbs = [0, 1, 2];

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="rounded-md border border-ink-700/5 bg-surface-soft p-4 lg:p-5">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${specimen.id}-${activeImage}`}
              src={specimen.imageUrl}
              alt={specimen.name}
              className="aspect-square w-full rounded-md object-cover"
              initial={reduce ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
            />
          </AnimatePresence>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {thumbs.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={
                  "aspect-square overflow-hidden rounded-md border-2 transition-colors " +
                  (activeImage === i
                    ? "border-brand-600 ring-2 ring-brand-100"
                    : "border-transparent opacity-75 hover:opacity-100")
                }
              >
                <img src={specimen.imageUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge tone="neutral">SAP-{specimen.id.slice(0, 8).toUpperCase()}</Badge>
            <Badge tone={specimen.stockStatus === "in_stock" ? "success" : "warning"}>
              ● {specimen.stockStatus.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <h2 className="font-display text-3xl leading-tight lg:text-4xl">{specimen.name}</h2>
          <div className="flex items-baseline gap-3">
            <p className="font-display text-3xl text-brand-600">
              {formatPrice(specimen.priceCents)}
            </p>
            {specimen.compareAtCents && (
              <p className="text-ink-400 line-through">{formatPrice(specimen.compareAtCents)}</p>
            )}
          </div>
          {specimen.originCountry && (
            <p className="text-xs uppercase tracking-wider text-ink-500">
              Provenance — {specimen.originCountry}
            </p>
          )}
          <p className="text-sm leading-relaxed text-ink-700">{specimen.description}</p>
          <Separator />
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={!isPurchasable(specimen.stockStatus)}
              onClick={() => add(specimen)}
            >
              <ShieldIcon className="h-4 w-4" /> Add to Collection
            </Button>
            <Button variant="secondary" type="button">
              <ShareIcon className="h-4 w-4" /> Share
            </Button>
          </div>

          <Card>
            <CardBody className="p-0">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setReportOpen((o) => !o)}
                aria-expanded={reportOpen}
              >
                <p className="font-display text-lg">Gemological Report</p>
                <span
                  className={
                    "text-brand-600 transition-transform " + (reportOpen ? "rotate-180" : "")
                  }
                  aria-hidden
                >
                  ▾
                </span>
              </button>
              <AnimatePresence initial={false}>
                {reportOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-ink-700/5 px-5 pb-5">
                      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        {Object.entries(specimen.attributes).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-baseline justify-between gap-2 border-b border-ink-700/5 pb-2"
                          >
                            <dt className="text-ink-500">{k}</dt>
                            <dd className="font-medium text-ink-900">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-ink-700">↓ Full PDF Report</p>
                        <button type="button" className="text-brand-600 hover:underline">
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>

          {compact && (
            <p className="text-xs text-ink-500">
              Use{" "}
              <kbd className="rounded border border-ink-700/10 bg-surface-muted px-1.5 py-0.5 text-[10px]">
                ←
              </kbd>{" "}
              /{" "}
              <kbd className="rounded border border-ink-700/10 bg-surface-muted px-1.5 py-0.5 text-[10px]">
                →
              </kbd>{" "}
              to browse specimens
            </p>
          )}

          {!compact && (
            <p className="text-xs text-ink-500">
              <Link
                to="/c/$category/p/$slug"
                params={{ category, slug: specimen.slug }}
                search={{}}
                className="text-brand-600 hover:underline"
              >
                Open full product page
              </Link>
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10 border-t border-ink-700/5 pt-8">
          <h3 className="font-display text-xl">Related specimens</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <ProductCard
                key={s.id}
                specimen={s}
                variant="grid"
                listingSearch={listingSearch}
                modalSlugs={related.map((r) => r.slug)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
