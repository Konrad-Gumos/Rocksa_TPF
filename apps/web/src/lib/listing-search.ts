import type { ListingSort } from "@rocksa/domain";

export interface ListingSearch {
  sub?: string;
  sort?: ListingSort;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  clarity?: string;
}

export interface ListingLocationState {
  listingSearch?: ListingSearch;
}

export const parseListingSearch = (search: Record<string, unknown>): ListingSearch => ({
  sub: typeof search["sub"] === "string" ? search["sub"] : undefined,
  sort:
    search["sort"] === "price-asc" || search["sort"] === "price-desc" || search["sort"] === "newest"
      ? search["sort"]
      : undefined,
  minPrice:
    search["minPrice"] !== undefined && search["minPrice"] !== ""
      ? Number(search["minPrice"])
      : undefined,
  maxPrice:
    search["maxPrice"] !== undefined && search["maxPrice"] !== ""
      ? Number(search["maxPrice"])
      : undefined,
  color: typeof search["color"] === "string" ? search["color"] : undefined,
  clarity: typeof search["clarity"] === "string" ? search["clarity"] : undefined,
});

/** Merge listing search updates and drop cleared (`undefined`) fields from the URL. */
export const mergeListingSearch = (
  prev: ListingSearch,
  next: Partial<ListingSearch>,
): ListingSearch => {
  const merged: ListingSearch = { ...prev, ...next };
  for (const key of Object.keys(next) as (keyof ListingSearch)[]) {
    if (next[key] === undefined) {
      delete merged[key];
    }
  }
  return merged;
};

export const listingSearchKey = (search: ListingSearch) =>
  [
    search.sort ?? "newest",
    search.sub ?? "",
    search.color ?? "",
    search.clarity ?? "",
    search.minPrice ?? "",
    search.maxPrice ?? "",
  ].join("|");
