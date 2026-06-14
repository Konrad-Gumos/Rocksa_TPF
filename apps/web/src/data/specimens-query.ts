import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Specimen } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";
import { SPECIMENS } from "./specimens.ts";
import { gemPlaceholder, paletteFor } from "./placeholder.ts";

export interface SpecimenRow {
  id: string;
  slug: string;
  name: string;
  category: Specimen["category"];
  subcategory: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  stockStatus: Specimen["stockStatus"];
  originCountry: string | null;
  imageUrl: string;
  attributes: Record<string, string>;
  createdAt?: string;
}

export const normalizeSpecimen = (r: SpecimenRow): Specimen => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  category: r.category,
  subcategory: r.subcategory,
  description: r.description,
  priceCents: r.priceCents,
  compareAtCents: r.compareAtCents,
  stockStatus: r.stockStatus,
  originCountry: r.originCountry,
  imageUrl: r.imageUrl || gemPlaceholder(r.slug, paletteFor(r.attributes?.["Color"])),
  attributes: r.attributes ?? {},
  ...(r.createdAt ? { createdAt: r.createdAt } : {}),
});

export const fetchAllSpecimens = async (): Promise<Specimen[]> => {
  const res = await apiOptional<{ items: SpecimenRow[] }>("/v1/specimens", {
    auth: false,
  });
  return res ? res.items.map(normalizeSpecimen) : SPECIMENS;
};

export const isApiCatalogLive = async (): Promise<boolean> => {
  const res = await apiOptional<{ items: SpecimenRow[] }>("/v1/specimens", {
    auth: false,
  });
  return res !== null;
};

export const fetchSpecimen = async (slug: string): Promise<Specimen | undefined> => {
  const res = await apiOptional<{ item: SpecimenRow }>(`/v1/specimens/${slug}`, {
    auth: false,
  });
  return res ? normalizeSpecimen(res.item) : SPECIMENS.find((s) => s.slug === slug);
};

export const specimensQueryOptions = queryOptions({
  queryKey: ["specimens"] as const,
  queryFn: fetchAllSpecimens,
  staleTime: 60_000,
});

export const specimenQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["specimen", slug] as const,
    queryFn: () => fetchSpecimen(slug),
    staleTime: 60_000,
  });

export const useSpecimens = () => useQuery(specimensQueryOptions);

export const useSpecimen = (slug: string) => useQuery(specimenQueryOptions(slug));

export const useSpecimensByCategory = (category: string) =>
  useQuery({
    queryKey: ["specimens", "category", category] as const,
    queryFn: async () => (await fetchAllSpecimens()).filter((s) => s.category === category),
    staleTime: 60_000,
  });

export const useSpecimenLookup = (): ((id: string) => Specimen | undefined) => {
  const { data = [] } = useSpecimens();
  const byId = new Map(data.map((s) => [s.id, s]));
  return (id) => byId.get(id);
};
