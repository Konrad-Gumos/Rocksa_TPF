export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  body: string;
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "caring-for-amethyst",
    title: "Caring for Amethyst Specimens",
    excerpt: "Light exposure, humidity, and display best practices for quartz collections.",
    date: "2024-10-01",
    body: "Amethyst derives its color from iron impurities and natural irradiation. Prolonged direct sunlight can fade saturation, so display pieces away from south-facing windows. Maintain stable humidity between 40–55% and avoid ultrasonic cleaners on geode matrices.",
  },
  {
    slug: "provenance-matters",
    title: "Why Provenance Matters",
    excerpt: "How origin documentation affects value and insurance underwriting.",
    date: "2024-09-12",
    body: "A specimen's origin country, mine locality, and chain of custody materially affect appraisal value. Rocksa catalogs origin metadata on every PDP and attaches gemological snapshots to fulfilled orders for insurance purposes.",
  },
  {
    slug: "building-a-collection",
    title: "Building an Investment-Grade Collection",
    excerpt: "Category diversification and liquidity considerations for serious collectors.",
    date: "2024-08-20",
    body: "Diversify across crystal, metamorphic, and sedimentary categories to reduce category-specific market shocks. Prioritize documented specimens with compare-at pricing transparency and verified stock status before acquisition.",
  },
];
