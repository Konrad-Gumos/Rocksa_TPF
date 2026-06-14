import { orderReference, type CartItem } from "@rocksa/domain";
import { apiOptional } from "../lib/api.ts";

export interface CreateOrderInput {
  items: CartItem[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface ServerOrder extends CreateOrderInput {
  id: string;
  reference: string;
  createdAt: string;
}

interface ServerOrderRow {
  id: string;
  reference: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: string;
}

export interface ServerOrderItem {
  specimenId: string;
  qty: number;
  unitPriceCents: number;
  snapshotJson: Record<string, unknown>;
}

export interface FetchedOrder extends ServerOrder {
  status: string;
  items: ServerOrderItem[];
}

export const createServerOrder = async (input: CreateOrderInput): Promise<ServerOrder | null> => {
  const res = await apiOptional<{ order: ServerOrderRow }>("/v1/orders", {
    method: "POST",
    body: {
      items: input.items.map((i) => ({
        specimenId: i.specimenId,
        qty: i.qty,
      })),
    },
  });
  if (!res) return null;
  return {
    ...input,
    id: res.order.id,
    reference: res.order.reference,
    createdAt: res.order.createdAt,
  };
};

export const fetchOrder = async (orderId: string): Promise<FetchedOrder | null> => {
  const res = await apiOptional<{ order: ServerOrderRow; items: ServerOrderItem[] }>(
    `/v1/orders/${orderId}`,
  );
  if (!res) return null;
  return {
    id: res.order.id,
    reference: res.order.reference,
    status: res.order.status,
    subtotalCents: res.order.subtotalCents,
    shippingCents: res.order.shippingCents,
    totalCents: res.order.totalCents,
    createdAt: res.order.createdAt,
    items: res.items,
  };
};

export const fetchOrders = async (): Promise<ServerOrderRow[]> => {
  const res = await apiOptional<{ orders: ServerOrderRow[] }>("/v1/orders");
  return res?.orders ?? [];
};

// Fallback for unauthenticated/local-only mode.
export const createLocalOrder = (input: CreateOrderInput): ServerOrder => ({
  ...input,
  id: crypto.randomUUID(),
  reference: orderReference(),
  createdAt: new Date().toISOString(),
});
