import { useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryListing } from "../../../components/CategoryListing.tsx";
import { specimensQueryOptions } from "../../../data/specimens-query.ts";
import {
  mergeListingSearch,
  parseListingSearch,
  type ListingSearch,
} from "../../../lib/listing-search.ts";

export const Route = createFileRoute("/c/$category/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(specimensQueryOptions),
  validateSearch: parseListingSearch,
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const onSearchChange = useCallback(
    (next: Partial<ListingSearch>) => {
      navigate({
        search: (prev) => mergeListingSearch(prev, next),
      });
    },
    [navigate],
  );

  return <CategoryListing category={category} search={search} onSearchChange={onSearchChange} />;
}
