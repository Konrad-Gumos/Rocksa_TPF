import { useMemo } from "react";
import {
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@rocksa/ui";
import { applyListing, attributeValues, type Category, type ListingSort } from "@rocksa/domain";
import { StorefrontLayout } from "./StorefrontLayout.tsx";
import { ProductCard } from "./ProductCard.tsx";
import { EmptyStateSuggestions } from "./EmptyStateSuggestions.tsx";
import { FadeInSection } from "./motion/FadeInSection.tsx";
import { StaggerGrid, StaggerItem } from "./motion/StaggerGrid.tsx";
import { useSpecimens } from "../data/specimens-query.ts";
import { listingSearchKey, type ListingSearch } from "../lib/listing-search.ts";
import { stickyFilterAsideClassName, storefrontMainClassName } from "../lib/layout.ts";

export type { ListingSearch };

const RATINGS = [4.9, 4.7, 5.0, 4.6, 4.8, 4.5, 4.9];
const titleCase = (s: string) => s[0]!.toUpperCase() + s.slice(1);

interface Props {
  category: string;
  search: ListingSearch;
  /** When true (modal background), filter controls are inert. */
  inert?: boolean;
  onSearchChange?: (next: Partial<ListingSearch>) => void;
}

export const CategoryListing = ({ category, search, inert = false, onSearchChange }: Props) => {
  const { data: all = [], isLoading } = useSpecimens();
  const searchKey = listingSearchKey(search);

  const inCategory = useMemo(
    () => all.filter((s) => s.category === (category as Category)),
    [all, category],
  );

  const subcategories = useMemo(
    () =>
      Array.from(
        new Set(inCategory.map((s) => s.subcategory).filter((v): v is string => !!v)),
      ).sort(),
    [inCategory],
  );

  const colors = useMemo(() => attributeValues(inCategory, "Color"), [inCategory]);
  const clarities = useMemo(() => attributeValues(inCategory, "Clarity"), [inCategory]);

  const items = useMemo(
    () =>
      applyListing(
        all,
        {
          category: category as Category,
          subcategory: search.sub,
          color: search.color,
          clarity: search.clarity,
          minPriceCents: search.minPrice ? search.minPrice * 100 : undefined,
          maxPriceCents: search.maxPrice ? search.maxPrice * 100 : undefined,
        },
        (search.sort ?? "newest") as ListingSort,
      ),
    [all, category, searchKey, search],
  );

  const setSearch = (next: Partial<ListingSearch>) => {
    if (inert || !onSearchChange) return;
    onSearchChange(next);
  };

  const showLoading = isLoading && items.length === 0;
  const Section = inert ? "div" : FadeInSection;

  return (
    <div aria-hidden={inert} className={inert ? "pointer-events-none" : ""}>
      <StorefrontLayout static={inert}>
        <main className={storefrontMainClassName}>
          <Section reveal="mount">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-display text-5xl">{titleCase(category)}</h1>
                <p className="text-ink-500 mt-1">Displaying {items.length} curated specimens.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-ink-500">Sort By:</span>
                <Select
                  value={search.sort ?? "newest"}
                  onValueChange={(v) => setSearch({ sort: v as ListingSearch["sort"] })}
                  disabled={inert}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-asc">Price ↑</SelectItem>
                    <SelectItem value="price-desc">Price ↓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
            <aside className={"space-y-6 text-sm " + stickyFilterAsideClassName}>
              {subcategories.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-500">Sub-categories</p>
                  <div className="mt-3 space-y-2">
                    {subcategories.map((sub) => (
                      <label key={sub} className="flex items-center gap-2 text-ink-700">
                        <Checkbox
                          checked={search.sub === sub}
                          disabled={inert}
                          onCheckedChange={(v) => setSearch({ sub: v ? sub : undefined })}
                        />
                        {sub}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-500">Filters</p>
                <div className="mt-3 space-y-3">
                  {colors.length > 0 && (
                    <div>
                      <Label htmlFor="filter-color">Color</Label>
                      <Select
                        value={search.color ?? "all"}
                        onValueChange={(v) => setSearch({ color: v === "all" ? undefined : v })}
                        disabled={inert}
                      >
                        <SelectTrigger id="filter-color" className="mt-1">
                          <SelectValue placeholder="Any color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any color</SelectItem>
                          {colors.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {clarities.length > 0 && (
                    <div>
                      <Label htmlFor="filter-clarity">Clarity</Label>
                      <Select
                        value={search.clarity ?? "all"}
                        onValueChange={(v) => setSearch({ clarity: v === "all" ? undefined : v })}
                        disabled={inert}
                      >
                        <SelectTrigger id="filter-clarity" className="mt-1">
                          <SelectValue placeholder="Any clarity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any clarity</SelectItem>
                          {clarities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="price-min">Price Range</Label>
                    <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <Input
                        id="price-min"
                        key={`min-${searchKey}`}
                        placeholder="Min"
                        inputMode="numeric"
                        defaultValue={search.minPrice ?? ""}
                        disabled={inert}
                        onBlur={(e) =>
                          setSearch({
                            minPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                      <span className="text-ink-400">–</span>
                      <Input
                        key={`max-${searchKey}`}
                        placeholder="Max"
                        inputMode="numeric"
                        defaultValue={search.maxPrice ?? ""}
                        disabled={inert}
                        onBlur={(e) =>
                          setSearch({
                            maxPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {inert ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {showLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[4/5]" />
                    ))
                  : items.map((s, i) => (
                      <ProductCard
                        key={s.id}
                        specimen={s}
                        rating={RATINGS[i % RATINGS.length]}
                        variant="grid"
                        listingSearch={search}
                        modalSlugs={items.map((item) => item.slug)}
                      />
                    ))}
                {!showLoading && items.length === 0 && (
                  <div className="col-span-full space-y-8 rounded-md border border-dashed border-ink-700/10 bg-white p-10">
                    <p className="text-center text-ink-500">No specimens match these filters.</p>
                    <EmptyStateSuggestions
                      specimens={inCategory.slice(0, 4)}
                      heading="Trending in this category"
                      categories={[]}
                    />
                  </div>
                )}
              </div>
            ) : (
              <StaggerGrid
                key={searchKey}
                reveal="mount"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {showLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="aspect-[4/5]" />
                    ))
                  : items.map((s, i) => (
                      <StaggerItem key={s.id}>
                        <ProductCard
                          specimen={s}
                          rating={RATINGS[i % RATINGS.length]}
                          variant="grid"
                          listingSearch={search}
                          modalSlugs={items.map((item) => item.slug)}
                        />
                      </StaggerItem>
                    ))}
                {!showLoading && items.length === 0 && (
                  <div className="col-span-full space-y-8 rounded-md border border-dashed border-ink-700/10 bg-white p-10">
                    <p className="text-center text-ink-500">No specimens match these filters.</p>
                    <EmptyStateSuggestions
                      specimens={inCategory.slice(0, 4)}
                      heading="Trending in this category"
                      categories={[]}
                    />
                  </div>
                )}
              </StaggerGrid>
            )}
          </div>
        </main>
      </StorefrontLayout>
    </div>
  );
};
