import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { useSpecimen, useSpecimens } from "../../../../data/specimens-query.ts";
import { ModalListingBackdrop } from "../../../../components/ModalListingBackdrop.tsx";
import { StorefrontLayout } from "../../../../components/StorefrontLayout.tsx";
import { ProductModal } from "../../../../components/ProductModal.tsx";
import { ProductDetail } from "../../../../components/ProductDetail.tsx";
import { FadeInSection } from "../../../../components/motion/FadeInSection.tsx";
import { storefrontMainClassName } from "../../../../lib/layout.ts";
import { useModalSpecimenNav } from "../../../../lib/modal-specimens.ts";
import type { ListingSearch } from "../../../../lib/listing-search.ts";

interface Search {
  modal?: boolean;
}

export const Route = createFileRoute("/c/$category/p/$slug")({
  component: ProductRoute,
  validateSearch: (s: Record<string, unknown>): Search => ({
    modal: s["modal"] === "1" || s["modal"] === true || s["modal"] === "true",
  }),
});

function ProductRoute() {
  const { slug, category } = Route.useParams();
  const { modal } = Route.useSearch();
  const { data: fetchedSpecimen, isLoading } = useSpecimen(slug);
  const { data: all = [] } = useSpecimens();
  const { listingSearch, modalSlugs, modalReturnTo } = useRouterState({
    select: (s) => ({
      listingSearch: s.location.state?.listingSearch,
      modalSlugs: s.location.state?.modalSlugs,
      modalReturnTo: s.location.state?.modalReturnTo,
    }),
  });

  const cachedSpecimen = useMemo(() => all.find((s) => s.slug === slug), [all, slug]);
  const specimen = fetchedSpecimen ?? cachedSpecimen;

  const { prev, next, position, total } = useModalSpecimenNav(
    all,
    category,
    slug,
    listingSearch,
    modalSlugs,
  );

  const related = useMemo(() => {
    if (!specimen) return [];
    return all
      .filter(
        (s) =>
          s.id !== specimen.id &&
          (s.subcategory === specimen.subcategory || s.category === specimen.category),
      )
      .slice(0, 4);
  }, [all, specimen]);

  const frozenBackdrop = useRef<{
    category: string;
    search: ListingSearch;
  } | null>(null);

  if (modal) {
    if (!frozenBackdrop.current || frozenBackdrop.current.category !== category) {
      frozenBackdrop.current = {
        category,
        search: (listingSearch ?? {}) as ListingSearch,
      };
    }
  } else {
    frozenBackdrop.current = null;
  }

  if (modal && specimen) {
    const backdropSearch = frozenBackdrop.current?.search ?? {};
    return (
      <ProductModal
        specimen={specimen}
        category={category}
        related={related}
        listingSearch={listingSearch}
        modalSlugs={modalSlugs}
        modalReturnTo={modalReturnTo}
        position={position}
        total={total}
        prev={prev}
        next={next}
        background={
          <ModalListingBackdrop
            key={`${category}:${JSON.stringify(backdropSearch)}`}
            category={category}
            search={backdropSearch}
          />
        }
      />
    );
  }

  if (!modal && isLoading && !specimen) {
    return (
      <main className="flex min-h-screen items-center justify-center text-ink-500">Loading…</main>
    );
  }

  if (!specimen) {
    return (
      <main className={storefrontMainClassName}>
        <p className="text-ink-500">Specimen not found.</p>
        <Link to="/c/$category" params={{ category }} className="text-brand-600">
          ← Back to category
        </Link>
      </main>
    );
  }

  return (
    <StorefrontLayout>
      <FadeInSection className={`${storefrontMainClassName} max-w-6xl`}>
        <ProductDetail
          specimen={specimen}
          category={category}
          related={related}
          listingSearch={listingSearch}
        />
      </FadeInSection>
    </StorefrontLayout>
  );
}
