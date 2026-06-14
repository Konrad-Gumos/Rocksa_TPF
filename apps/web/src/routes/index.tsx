import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, CardBody } from "@rocksa/ui";
import { formatPrice } from "@rocksa/domain";
import { TopNav } from "../components/TopNav.tsx";
import { PageMeta } from "../components/PageMeta.tsx";
import { CategorySidebar } from "../components/CategorySidebar.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { ArrowRightIcon } from "../components/Icons.tsx";
import { useSpecimens } from "../data/api-specimens.ts";
import { specimensQueryOptions } from "../data/specimens-query.ts";
import {
  collectionQueryOptions,
  featuredDeal,
  newArrivals,
  staffPickFallback,
} from "../data/merchandising.ts";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(specimensQueryOptions),
      context.queryClient.ensureQueryData(collectionQueryOptions("staff-picks")),
    ]),
  component: Landing,
});

function Landing() {
  const { data = [] } = useSpecimens();
  const { data: staffPicks = [] } = useQuery(collectionQueryOptions("staff-picks"));

  const deal = featuredDeal(data);
  const arrivals = newArrivals(data);
  const picks = staffPicks.length > 0 ? staffPicks : staffPickFallback(data);

  return (
    <div>
      <PageMeta
        title="Rocksa — Curated Mineral Collection"
        description="Discover exceptional gemstones and minerals with provenance, certification, and secure checkout."
      />
      <TopNav />
      <div className="flex">
        <CategorySidebar
          heading="The Collection"
          subheading="Curator's Workspace"
        />
        <main className="flex-1 px-10 py-10">
          <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="relative overflow-hidden rounded-md bg-ink-900 text-white">
              {deal && (
                <img
                  src={deal.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
              )}
              <div className="relative z-10 max-w-md p-8">
                <Badge tone="brand" className="bg-brand-200/90 text-brand-700">
                  FEATURED ACQUISITION
                </Badge>
                <h1 className="font-display text-4xl mt-4 leading-tight">
                  {deal?.name ?? "Featured Specimen"}
                </h1>
                <p className="text-sm mt-3 text-white/85 max-w-sm">
                  {deal?.description ??
                    "Exceptional clarity and saturation from our latest catalog."}
                </p>
                {deal && (
                  <p className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-2xl">
                      {formatPrice(deal.priceCents)}
                    </span>
                    {deal.compareAtCents && (
                      <span className="text-sm text-white/60 line-through">
                        {formatPrice(deal.compareAtCents)}
                      </span>
                    )}
                  </p>
                )}
                <Button asChild className="mt-6">
                  {deal ? (
                    <Link
                      to="/c/$category/p/$slug"
                      params={{ category: deal.category, slug: deal.slug }}
                      search={{ modal: true }}
                    >
                      View specimen <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  ) : (
                    <Link to="/c/$category" params={{ category: "crystals" }}>
                      Explore Collection <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardBody>
                  <h3 className="font-display text-xl">Curator's Notes</h3>
                  <p className="text-sm text-ink-500 mt-2">
                    Recent assay confirms high silica purity and optimal
                    crystalline structure across the latest batch of South
                    American imports.
                  </p>
                  <Link to="/journal" className="mt-3 inline-block text-sm font-medium text-brand-600">
                    READ FULL REPORT
                  </Link>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h3 className="font-display text-xl">Investment Grade</h3>
                  <p className="text-sm text-ink-500 mt-2">
                    Track market values and historical data for premium mineral
                    acquisitions within your workspace.
                  </p>
                  <Link to="/investment" className="mt-3 inline-block text-sm font-medium text-brand-600">
                    VIEW METRICS
                  </Link>
                </CardBody>
              </Card>
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl">New Arrivals</h2>
              <Link
                to="/c/$category"
                params={{ category: "crystals" }}
                search={{ sort: "newest" }}
                className="text-sm font-medium text-brand-600"
              >
                View all
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {arrivals.map((s) => (
                <ProductCard key={s.id} specimen={s} />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl">Polecamy — Staff Picks</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {picks.map((s) => (
                <ProductCard key={s.id} specimen={s} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
