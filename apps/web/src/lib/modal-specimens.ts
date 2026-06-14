import { useMemo } from "react";
import { applyListing, type Category, type ListingSort, type Specimen } from "@rocksa/domain";
import type { ListingSearch } from "./listing-search.ts";

export const resolveModalSpecimens = (
  all: Specimen[],
  category: string,
  slug: string,
  listingSearch?: ListingSearch,
  modalSlugs?: string[],
): Specimen[] => {
  if (modalSlugs?.length) {
    const bySlug = new Map(all.map((s) => [s.slug, s]));
    const ordered = modalSlugs.map((s) => bySlug.get(s)).filter((s): s is Specimen => !!s);
    if (ordered.some((s) => s.slug === slug)) return ordered;
  }

  return applyListing(
    all,
    {
      category: category as Category,
      subcategory: listingSearch?.sub,
      color: listingSearch?.color,
      clarity: listingSearch?.clarity,
      minPriceCents: listingSearch?.minPrice ? listingSearch.minPrice * 100 : undefined,
      maxPriceCents: listingSearch?.maxPrice ? listingSearch.maxPrice * 100 : undefined,
    },
    (listingSearch?.sort ?? "newest") as ListingSort,
  );
};

export const useModalSpecimenNav = (
  all: Specimen[],
  category: string,
  slug: string,
  listingSearch?: ListingSearch,
  modalSlugs?: string[],
) =>
  useMemo(() => {
    const items = resolveModalSpecimens(all, category, slug, listingSearch, modalSlugs);
    const index = items.findIndex((s) => s.slug === slug);
    return {
      items,
      index,
      total: items.length,
      prev: index > 0 ? items[index - 1] : undefined,
      next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
      position: index >= 0 ? index + 1 : 0,
    };
  }, [all, category, slug, listingSearch, modalSlugs]);
