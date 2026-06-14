import { describe, expect, it } from "vitest";
import type { Specimen } from "./types.ts";
import { searchSpecimens } from "./catalog.ts";

const sample: Specimen = {
  id: "1",
  slug: "deep-blue-sapphire",
  name: "Deep Blue Sapphire",
  category: "crystals",
  subcategory: "Corundum",
  description: "Natural sapphire from Sri Lanka.",
  priceCents: 100_00,
  compareAtCents: null,
  stockStatus: "in_stock",
  originCountry: "Sri Lanka",
  imageUrl: "",
  attributes: { Color: "Blue", Clarity: "VVS" },
};

describe("searchSpecimens", () => {
  it("matches name, description, and attributes", () => {
    expect(searchSpecimens([sample], "sapphire")).toHaveLength(1);
    expect(searchSpecimens([sample], "lanka")).toHaveLength(1);
    expect(searchSpecimens([sample], "vvs")).toHaveLength(1);
    expect(searchSpecimens([sample], "ruby")).toHaveLength(0);
  });

  it("returns empty for blank query", () => {
    expect(searchSpecimens([sample], "   ")).toHaveLength(0);
  });
});
