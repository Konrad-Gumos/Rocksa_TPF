import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button, Card, CardBody } from "@rocksa/ui";
import { searchSpecimens } from "@rocksa/domain";
import { StorefrontLayout } from "../components/StorefrontLayout.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { EmptyStateSuggestions } from "../components/EmptyStateSuggestions.tsx";
import { FadeInSection } from "../components/motion/FadeInSection.tsx";
import { StaggerGrid, StaggerItem } from "../components/motion/StaggerGrid.tsx";
import { storefrontMainClassName } from "../lib/layout.ts";
import { specimensQueryOptions, useSpecimens } from "../data/specimens-query.ts";

interface SearchParams {
  q: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(specimensQueryOptions),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: all = [], isLoading } = useSpecimens();

  const results = useMemo(() => searchSpecimens(all, q), [all, q]);

  return (
    <StorefrontLayout>
      <main className={storefrontMainClassName}>
        <FadeInSection>
          <h1 className="font-display text-5xl">Search</h1>
          <p className="mt-2 text-ink-500">
            {q
              ? isLoading
                ? "Searching the collection…"
                : `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
              : "Enter a term in the search bar to explore the collection."}
          </p>
        </FadeInSection>

        {!q && (
          <FadeInSection className="mt-10" delay={0.05}>
            <Card>
              <CardBody className="py-12 text-center">
                <p className="text-ink-500">Try searching by gemstone, color, or origin.</p>
              </CardBody>
            </Card>
          </FadeInSection>
        )}

        {q && !isLoading && results.length === 0 && (
          <FadeInSection className="mt-10 space-y-8" delay={0.05}>
            <Card>
              <CardBody className="space-y-4 py-12 text-center">
                <p className="text-ink-500">No specimens match “{q}”.</p>
                <Button asChild variant="secondary">
                  <Link to="/">Browse all collections</Link>
                </Button>
              </CardBody>
            </Card>
            <EmptyStateSuggestions specimens={all.slice(0, 4)} />
          </FadeInSection>
        )}

        {results.length > 0 && (
          <FadeInSection className="mt-10" delay={0.08}>
            <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((specimen) => (
                <StaggerItem key={specimen.id}>
                  <ProductCard
                    specimen={specimen}
                    variant="grid"
                    modalSlugs={results.map((r) => r.slug)}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </FadeInSection>
        )}
      </main>
    </StorefrontLayout>
  );
}
