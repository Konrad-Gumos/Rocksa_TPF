import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "rocksa.wishlist";

const readIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const writeIds = (ids: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

interface WishlistValue {
  ids: string[];
  isSaved: (specimenId: string) => boolean;
  toggle: (specimenId: string) => void;
}

const WishlistContext = createContext<WishlistValue | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [ids, setIds] = useState<string[]>(() => readIds());

  const toggle = useCallback((specimenId: string) => {
    setIds((prev) => {
      const next = prev.includes(specimenId)
        ? prev.filter((id) => id !== specimenId)
        : [...prev, specimenId];
      writeIds(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      ids,
      isSaved: (specimenId: string) => ids.includes(specimenId),
      toggle,
    }),
    [ids, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistValue => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
};
