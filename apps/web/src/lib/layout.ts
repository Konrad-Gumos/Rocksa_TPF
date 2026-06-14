/** Sticky top navigation bar. */
export const stickyTopNavClassName =
  "sticky top-0 z-50 w-full border-b border-ink-700/5 bg-surface-muted/95 backdrop-blur-sm supports-[backdrop-filter]:bg-surface-muted/80";

/** Horizontal page gutter — matches top nav and main content. */
export const layoutPaddingX = "px-6 lg:px-10";

/** Default main content vertical padding. */
export const layoutPaddingY = "py-10";

export const topNavInnerClassName = `flex h-16 w-full items-center gap-4 ${layoutPaddingX}`;

export const storefrontMainClassName = `flex-1 min-w-0 ${layoutPaddingX} ${layoutPaddingY}`;

/** Checkout flow main column — same horizontal gutter as the top nav. */
export const checkoutMainClassName = `mx-auto max-w-6xl gap-12 ${layoutPaddingX} ${layoutPaddingY}`;

/** Sticky offset below the 4rem top nav, with consistent inner padding while scrolling. */
const stickyBelowNavClassName =
  "sticky top-16 self-start max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain pt-4 pb-6";

/** Left storefront / account / workspace navigation column. */
export const stickySidebarClassName = `z-30 ${stickyBelowNavClassName}`;

/** Category listing filter column. */
export const stickyFilterAsideClassName = `z-20 ${stickyBelowNavClassName}`;
