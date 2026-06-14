import { queryOptions } from "@tanstack/react-query";
import {
  normalizeSpecimen,
  type SpecimenRow,
} from "./specimens-query.ts";
import { apiOptional } from "../lib/api.ts";
import type { Specimen } from "@rocksa/domain";

export const fetchCollection = async (slug: string): Promise<Specimen[]> => {
  const res = await apiOptional<{ items: SpecimenRow[] }>(
    `/v1/collections/${slug}`,
    { auth: false },
  );
  return res ? res.items.map(normalizeSpecimen) : [];
};

export const collectionQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["collection", slug] as const,
    queryFn: () => fetchCollection(slug),
    staleTime: 60_000,
  });

export const featuredDeal = (items: Specimen[]): Specimen | undefined => {
  const withCompare = items.filter(
    (s) => s.compareAtCents !== null && s.compareAtCents > s.priceCents,
  );
  if (withCompare.length === 0) return items[0];
  return withCompare.sort(
    (a, b) =>
      (b.compareAtCents! - b.priceCents) - (a.compareAtCents! - a.priceCents),
  )[0];
};

export const newArrivals = (items: Specimen[], limit = 4): Specimen[] =>
  [...items]
    .sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return bTime - aTime;
    })
    .slice(0, limit);

export const staffPickFallback = (items: Specimen[], limit = 4): Specimen[] =>
  items.slice(0, limit);
