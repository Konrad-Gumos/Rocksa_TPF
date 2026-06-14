import { memo } from "react";
import { CategoryListing, type ListingSearch } from "./CategoryListing.tsx";

interface Props {
  category: string;
  search: ListingSearch;
}

/** Stable backdrop for product modals — does not remount when the slug changes. */
export const ModalListingBackdrop = memo(function ModalListingBackdrop({
  category,
  search,
}: Props) {
  return <CategoryListing category={category} search={search} inert />;
});
