import { describe, expect, it } from "vitest";
import { isPurchasable } from "./stock.ts";

describe("isPurchasable", () => {
  it("allows in_stock and low_stock", () => {
    expect(isPurchasable("in_stock")).toBe(true);
    expect(isPurchasable("low_stock")).toBe(true);
  });

  it("blocks on_display and sold", () => {
    expect(isPurchasable("on_display")).toBe(false);
    expect(isPurchasable("sold")).toBe(false);
  });
});
