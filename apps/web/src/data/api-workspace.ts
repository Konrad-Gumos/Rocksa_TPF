import { apiOptional } from "../lib/api.ts";

export interface WorkspaceStats {
  specimenCount: number;
  collectionValueCents: number;
  pendingShipments: number;
}

export const fetchWorkspaceOverview = async () => {
  const res = await apiOptional<{
    stats: WorkspaceStats;
    recentOrders: Array<{
      id: string;
      reference: string;
      status: string;
      totalCents: number;
      createdAt: string;
    }>;
  }>("/v1/workspace/overview");
  return res;
};

export const fetchWorkspaceShipments = async () => {
  const res = await apiOptional<{
    shipments: Array<{
      id: string;
      orderId: string;
      origin: string | null;
      status: string;
      eta: string | null;
    }>;
  }>("/v1/workspace/shipments");
  return res?.shipments ?? [];
};

export interface NewSpecimenInput {
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  priceCents: number;
  originCountry?: string;
}

export const createSpecimen = async (input: NewSpecimenInput) => {
  const res = await apiOptional<{ item: { id: string } }>("/v1/workspace/specimens", {
    method: "POST",
    body: input,
  });
  return res?.item ?? null;
};

export const downloadInventoryReport = async (): Promise<void> => {
  const token = await (await import("@rocksa/auth")).firebaseAuth.currentUser?.getIdToken();
  const base = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8787";
  const res = await fetch(`${base}/v1/workspace/reports/inventory`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) return;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "inventory-snapshot.csv";
  a.click();
  URL.revokeObjectURL(url);
};
