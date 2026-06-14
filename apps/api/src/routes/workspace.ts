import { Hono } from "hono";
import { count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { orders, shipments, specimens } from "@rocksa/db/schema";
import { requireAuth, type AuthUser } from "../auth.ts";

const curatorOnly = async (
  c: { get: (k: "user") => AuthUser; json: (body: unknown, status?: number) => Response },
  next: () => Promise<void>,
) => {
  const user = c.get("user");
  if (!["curator", "admin"].includes(user.role)) {
    return c.json({ error: "forbidden" }, 403);
  }
  await next();
};

export const workspaceRouter = new Hono<{ Variables: { user: AuthUser } }>();
workspaceRouter.use("*", requireAuth, curatorOnly);

workspaceRouter.get("/overview", async (c) => {
  const [specimenRow] = await db.select({ count: count() }).from(specimens);
  const [valueRow] = await db
    .select({ total: sql<number>`coalesce(sum(${specimens.priceCents}), 0)` })
    .from(specimens);
  const [pendingRow] = await db
    .select({ count: count() })
    .from(shipments)
    .where(eq(shipments.status, "pending"));
  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

  return c.json({
    stats: {
      specimenCount: specimenRow?.count ?? 0,
      collectionValueCents: Number(valueRow?.total ?? 0),
      pendingShipments: pendingRow?.count ?? 0,
    },
    recentOrders,
  });
});

workspaceRouter.get("/shipments", async (c) => {
  const rows = await db.select().from(shipments).orderBy(desc(shipments.eta));
  return c.json({ shipments: rows });
});

const specimenBody = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  description: z.string().min(1),
  priceCents: z.number().int().min(0),
  stockStatus: z.string().optional(),
  originCountry: z.string().optional(),
});

workspaceRouter.post("/specimens", async (c) => {
  const body = specimenBody.parse(await c.req.json());
  const inserted = await db
    .insert(specimens)
    .values({
      slug: body.slug,
      name: body.name,
      category: body.category,
      subcategory: body.subcategory ?? null,
      description: body.description,
      priceCents: body.priceCents,
      stockStatus: body.stockStatus ?? "in_stock",
      originCountry: body.originCountry ?? null,
    })
    .returning();
  return c.json({ item: inserted[0] });
});

workspaceRouter.get("/reports/inventory", async (_c) => {
  const rows = await db.select().from(specimens);
  const lines = [
    "slug,name,category,price_cents,stock_status",
    ...rows.map(
      (r) => `${r.slug},${JSON.stringify(r.name)},${r.category},${r.priceCents},${r.stockStatus}`,
    ),
  ];
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="inventory-snapshot.csv"',
    },
  });
});
