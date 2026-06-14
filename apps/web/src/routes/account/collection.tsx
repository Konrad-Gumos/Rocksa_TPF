import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { useSpecimens } from "../../data/specimens-query.ts";
import { useWishlist } from "../../state/wishlist.tsx";
import { ProductCard } from "../../components/ProductCard.tsx";
import { storefrontMainClassName } from "../../lib/layout.ts";

export const Route = createFileRoute("/account/collection")({ component: MyCollection });

function MyCollection() {
  const { ids } = useWishlist();
  const { data: all = [] } = useSpecimens();
  const saved = all.filter((s) => ids.includes(s.id));

  return (
    <main className={storefrontMainClassName}>
      <h1 className="font-display text-5xl">My Collection</h1>
      <p className="mt-2 text-ink-500">Specimens you have saved for later.</p>

      {saved.length === 0 ? (
        <Card className="mt-10">
          <CardBody className="space-y-4 py-12 text-center">
            <p className="text-ink-500">Your wishlist is empty.</p>
            <Button asChild variant="secondary">
              <Link to="/">Explore the collection</Link>
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((specimen) => (
            <ProductCard key={specimen.id} specimen={specimen} variant="grid" />
          ))}
        </div>
      )}
    </main>
  );
}
