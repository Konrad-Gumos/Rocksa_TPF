import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Dialog,
  DialogContent,
  Separator,
} from "@rocksa/ui";
import { formatPrice, isPurchasable } from "@rocksa/domain";
import { useSpecimen, useSpecimens } from "../../../../data/api-specimens.ts";
import {
  CloseIcon,
  ShareIcon,
  ShieldIcon,
} from "../../../../components/Icons.tsx";
import {
  CategoryListing,
  type ListingSearch,
} from "../../../../components/CategoryListing.tsx";
import { TopNav } from "../../../../components/TopNav.tsx";
import { ProductCard } from "../../../../components/ProductCard.tsx";
import { useCart } from "@rocksa/cart";

const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

interface Search {
  modal?: boolean;
}

export const Route = createFileRoute("/c/$category/p/$slug")({
  component: ProductRoute,
  validateSearch: (s: Record<string, unknown>): Search => ({
    modal: s["modal"] === "1" || s["modal"] === true || s["modal"] === "true",
  }),
});

function ProductRoute() {
  const { slug, category } = Route.useParams();
  const { modal } = Route.useSearch();
  const { data: specimen, isLoading } = useSpecimen(slug);
  const { data: all = [] } = useSpecimens();
  const navigate = useNavigate();
  const { add } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  const related = useMemo(() => {
    if (!specimen) return [];
    return all
      .filter(
        (s) =>
          s.id !== specimen.id &&
          (s.subcategory === specimen.subcategory || s.category === specimen.category),
      )
      .slice(0, 4);
  }, [all, specimen]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-ink-500">
        Loading…
      </main>
    );
  }

  if (!specimen) {
    return (
      <main className="p-10">
        <p className="text-ink-500">Specimen not found.</p>
        <Link to="/c/$category" params={{ category }} className="text-brand-600">
          ← Back to category
        </Link>
      </main>
    );
  }

  const body = (
    <>
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-500">
        <Link to="/" className="text-brand-600 hover:underline">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link
          to="/c/$category"
          params={{ category }}
          className="text-brand-600 hover:underline"
        >
          {titleCase(category)}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink-900">{specimen.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="rounded-md border border-ink-700/5 bg-white p-6">
          <img
            src={specimen.imageUrl}
            alt={specimen.name}
            className="aspect-square w-full rounded-md object-cover"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={
                  "aspect-square overflow-hidden rounded-md border " +
                  (activeImage === i ? "border-brand-600" : "border-ink-700/10")
                }
              >
                <img
                  src={specimen.imageUrl}
                  alt=""
                  className={
                    "h-full w-full object-cover " + (activeImage === i ? "" : "opacity-80")
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs">
            <Badge tone="neutral">SAP-{specimen.id.slice(0, 8).toUpperCase()}</Badge>
            <Badge
              tone={specimen.stockStatus === "in_stock" ? "success" : "warning"}
            >
              ● {specimen.stockStatus.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <h2 className="font-display text-4xl leading-tight">{specimen.name}</h2>
          <div className="flex items-baseline gap-3">
            <p className="font-display text-3xl text-brand-600">
              {formatPrice(specimen.priceCents)}
            </p>
            {specimen.compareAtCents && (
              <p className="text-ink-400 line-through">
                {formatPrice(specimen.compareAtCents)}
              </p>
            )}
          </div>
          {specimen.originCountry && (
            <p className="text-xs uppercase tracking-wider text-ink-500">
              Provenance — {specimen.originCountry}
            </p>
          )}
          <p className="text-sm text-ink-700 leading-relaxed">
            {specimen.description}
          </p>
          <Separator />
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={!isPurchasable(specimen.stockStatus)}
              onClick={() => add(specimen)}
            >
              <ShieldIcon className="h-4 w-4" /> Add to Collection
            </Button>
            <Button variant="secondary">
              <ShareIcon className="h-4 w-4" /> Share
            </Button>
          </div>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <p className="font-display text-lg">Gemological Report</p>
                <span className="text-brand-600">▾</span>
              </div>
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
                <a className="text-brand-600">Download</a>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h3 className="font-display text-2xl">Related Specimens</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((s) => (
              <ProductCard key={s.id} specimen={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );

  if (modal) {
    const close = () =>
      navigate({ to: "/c/$category", params: { category }, search: {} });
    return (
      <>
        <CategoryListing
          category={category}
          search={{} as ListingSearch}
          inert
        />
        <Dialog open onOpenChange={(open) => !open && close()}>
          <DialogContent className="max-h-[90vh] w-[92vw] overflow-y-auto">
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-ink-700 hover:bg-ink-700/10"
            >
              <CloseIcon />
            </button>
            {body}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="mx-auto max-w-6xl p-10">{body}</div>
    </div>
  );
}
