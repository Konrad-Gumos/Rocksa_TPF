import { Link } from "@tanstack/react-router";
import type { Specimen } from "@rocksa/domain";
import { ProductCard } from "./ProductCard.tsx";

interface Props {
  specimens: Specimen[];
  heading?: string;
  categories?: Array<{ label: string; category: Specimen["category"] }>;
}

const DEFAULT_CATEGORIES: Props["categories"] = [
  { label: "Crystals", category: "crystals" },
  { label: "Igneous", category: "igneous" },
  { label: "Metamorphic", category: "metamorphic" },
];

export const EmptyStateSuggestions = ({
  specimens,
  heading = "You might also like",
  categories = DEFAULT_CATEGORIES,
}: Props) => (
  <div className="space-y-6">
    {categories && categories.length > 0 && (
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(({ label, category }) => (
          <Link
            key={category}
            to="/c/$category"
            params={{ category }}
            className="rounded-md border border-ink-700/10 px-3 py-1.5 text-sm text-brand-600 hover:bg-brand-50"
          >
            Browse {label}
          </Link>
        ))}
      </div>
    )}
    {specimens.length > 0 && (
      <div>
        <h3 className="text-center font-display text-xl">{heading}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {specimens.map((specimen) => (
            <ProductCard key={specimen.id} specimen={specimen} />
          ))}
        </div>
      </div>
    )}
  </div>
);
