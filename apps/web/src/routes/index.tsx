import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Badge, Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { PageMeta } from "../components/PageMeta.tsx";
import { StorefrontLayout } from "../components/StorefrontLayout.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { FadeInSection } from "../components/motion/FadeInSection.tsx";
import { StaggerGrid, StaggerItem } from "../components/motion/StaggerGrid.tsx";
import { ArrowRightIcon, LockIcon, ShieldIcon } from "../components/Icons.tsx";
import { specimensQueryOptions, useSpecimens } from "../data/specimens-query.ts";
import {
  collectionQueryOptions,
  featuredDeal,
  newArrivals,
  staffPickFallback,
} from "../data/merchandising.ts";
import { defaultTransition, EASE } from "../lib/motion.ts";
import { layoutPaddingX, storefrontMainClassName } from "../lib/layout.ts";
import { saveListingScroll } from "../lib/listing-scroll.ts";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(specimensQueryOptions),
      context.queryClient.ensureQueryData(collectionQueryOptions("staff-picks")),
    ]),
  component: Landing,
});

const TRUST_ITEMS = [
  { icon: ShieldIcon, label: "Certificate of authenticity" },
  { icon: LockIcon, label: "Insured secure shipping" },
] as const;

function TrustBar() {
  const reduce = useReducedMotion();

  return (
    <div className="border-b border-ink-700/5 bg-white">
      <motion.div
        className={`flex flex-wrap items-center justify-center gap-6 py-3 text-xs text-ink-500 ${layoutPaddingX}`}
        initial={reduce ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, delay: 0.12 }}
      >
        {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
          <motion.span
            key={label}
            className="inline-flex items-center gap-2"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...defaultTransition, delay: 0.14 + i * 0.05 }}
          >
            <Icon className="h-3.5 w-3.5 text-brand-600" />
            {label}
          </motion.span>
        ))}
        <span className="hidden sm:inline text-ink-300">|</span>
        <span>Complimentary shipping on qualifying orders</span>
      </motion.div>
    </div>
  );
}

function Landing() {
  const { data = [] } = useSpecimens();
  const { data: staffPicks = [] } = useQuery(collectionQueryOptions("staff-picks"));
  const reduce = useReducedMotion();

  const deal = featuredDeal(data);
  const arrivals = newArrivals(data);
  const picks = staffPicks.length > 0 ? staffPicks : staffPickFallback(data);

  const savingsCents =
    deal?.compareAtCents && deal.compareAtCents > deal.priceCents
      ? deal.compareAtCents - deal.priceCents
      : null;

  return (
    <>
      <PageMeta
        title="Rocksa — Curated Mineral Collection"
        description="Discover exceptional gemstones and minerals with provenance, certification, and secure checkout."
      />
      <StorefrontLayout banner={<TrustBar />}>
        <main className={storefrontMainClassName}>
          <FadeInSection>
            <div className="relative min-h-[380px] overflow-hidden rounded-md bg-ink-900 text-white lg:min-h-[420px]">
              {deal && (
                <motion.img
                  src={deal.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={reduce ? false : { scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/75 to-ink-900/30" />
              <motion.div
                className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...defaultTransition, delay: 0.15, duration: 0.55 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand" className="bg-brand-200/90 text-brand-700">
                    Featured acquisition
                  </Badge>
                  {savingsCents && (
                    <Badge tone="success" className="bg-emerald-100/90 text-emerald-800">
                      Save {formatPrice(savingsCents)}
                    </Badge>
                  )}
                </div>
                <h1 className="font-display mt-4 max-w-lg text-4xl leading-tight md:text-5xl">
                  {deal?.name ?? "Exceptional specimens, curated for collectors"}
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
                  {deal?.description ??
                    "Museum-grade minerals and gemstones with documented provenance and secure vault transfer."}
                </p>
                {deal?.originCountry && (
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
                    Provenance — {deal.originCountry}
                  </p>
                )}
                {deal && (
                  <p className="mt-5 flex items-baseline gap-3">
                    <span className="font-display text-3xl">{formatPrice(deal.priceCents)}</span>
                    {deal.compareAtCents && (
                      <span className="text-base text-white/50 line-through">
                        {formatPrice(deal.compareAtCents)}
                      </span>
                    )}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild size="lg">
                    {deal ? (
                      <Link
                        to="/c/$category/p/$slug"
                        params={{ category: deal.category, slug: deal.slug }}
                        search={{ modal: true }}
                        state={{
                          modalSlugs: arrivals.map((a) => a.slug),
                          modalReturnTo: "/",
                        }}
                        onClick={() => saveListingScroll()}
                      >
                        View specimen <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link to="/c/$category" params={{ category: "crystals" }}>
                        Explore collection <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    <Link to="/search" search={{ q: "sapphire" }}>
                      Search collection
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </FadeInSection>

          <FadeInSection className="mt-14" delay={0.05}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">Just added</p>
                <h2 className="font-display text-3xl">New Arrivals</h2>
              </div>
              <Link
                to="/c/$category"
                params={{ category: "crystals" }}
                search={{ sort: "newest" }}
                className="shrink-0 text-sm font-medium text-brand-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {arrivals.map((s) => (
                <StaggerItem key={s.id}>
                  <ProductCard
                    specimen={s}
                    variant="grid"
                    modalSlugs={arrivals.map((a) => a.slug)}
                    modalReturnTo="/"
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeInSection>

          <FadeInSection className="mt-14" delay={0.08}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">Polecamy</p>
                <h2 className="font-display text-3xl">Staff Picks</h2>
                <p className="mt-1 text-sm text-ink-500">Hand-selected by our senior curators.</p>
              </div>
              <Link
                to="/c/$category"
                params={{ category: "crystals" }}
                className="shrink-0 text-sm font-medium text-brand-600 hover:underline"
              >
                Browse all
              </Link>
            </div>
            <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {picks.map((s) => (
                <StaggerItem key={s.id}>
                  <ProductCard
                    specimen={s}
                    variant="grid"
                    modalSlugs={picks.map((p) => p.slug)}
                    modalReturnTo="/"
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeInSection>

          <FadeInSection className="mt-14" delay={0.1}>
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.005 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="overflow-hidden border-brand-200/60 bg-gradient-to-br from-brand-50/80 to-white">
                <CardBody className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
                  <div className="max-w-xl">
                    <h2 className="font-display text-2xl md:text-3xl">
                      Commission a bespoke acquisition
                    </h2>
                    <p className="mt-2 text-sm text-ink-600">
                      Work directly with a curator to source, certify, and deliver a specimen
                      tailored to your collection.
                    </p>
                  </div>
                  <Button asChild size="lg">
                    <Link to="/custom-design">
                      Start inquiry <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </FadeInSection>
        </main>
      </StorefrontLayout>
    </>
  );
}
