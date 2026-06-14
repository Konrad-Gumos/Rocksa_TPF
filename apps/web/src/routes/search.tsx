import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button, Card, CardBody } from "@rocksa/ui";
import { searchSpecimens } from "@rocksa/domain";
import { TopNav } from "../components/TopNav.tsx";
import { ProductCard } from "../components/ProductCard.tsx";
import { useSpecimens } from "../data/api-specimens.ts";
import { specimensQueryOptions } from "../data/specimens-query.ts";

interface SearchParams {
  q: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(specimensQueryOptions),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: all = [], isLoading } = useSpecimens();

  const results = useMemo(() => searchSpecimens(all, q), [all, q]);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <h1 className="font-display text-5xl">Search</h1>
        <p className="mt-2 text-ink-500">
          {q
            ? isLoading
              ? "Searching the collection…"
              : `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
            : "Enter a term in the search bar to explore the collection."}
        </p>

        {!q && (
          <Card className="mt-10">
            <CardBody className="py-12 text-center">
              <p className="text-ink-500">Try searching by gemstone, color, or origin.</p>
            </CardBody>
          </Card>
        )}

        {q && !isLoading && results.length === 0 && (
          <Card className="mt-10">
            <CardBody className="space-y-4 py-12 text-center">
              <p className="text-ink-500">No specimens match “{q}”.</p>
              <Button asChild variant="secondary">
                <Link to="/">Browse all collections</Link>
              </Button>
            </CardBody>
          </Card>
        )}

        {results.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((specimen) => (
              <ProductCard key={specimen.id} specimen={specimen} variant="grid" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
