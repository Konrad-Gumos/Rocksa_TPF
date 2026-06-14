import type { StockStatus } from "./types.ts";

export const isPurchasable = (status: StockStatus): boolean =>
  status === "in_stock" || status === "low_stock";
