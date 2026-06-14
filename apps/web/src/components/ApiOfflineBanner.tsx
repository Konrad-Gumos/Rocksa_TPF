import { useQuery } from "@tanstack/react-query";
import { Badge } from "@rocksa/ui";
import { useState } from "react";
import { isApiCatalogLive } from "../data/specimens-query.ts";

export const ApiOfflineBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { data: live } = useQuery({
    queryKey: ["catalog-live"],
    queryFn: isApiCatalogLive,
    staleTime: 30_000,
  });

  if (dismissed || live !== false) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      <Badge tone="warning" className="mr-2">
        Demo catalog
      </Badge>
      API unavailable — showing local specimens. Run{" "}
      <code className="text-xs">docker compose up -d db</code> and the API for live data.{" "}
      <button type="button" className="ml-2 underline" onClick={() => setDismissed(true)}>
        Dismiss
      </button>
    </div>
  );
};
