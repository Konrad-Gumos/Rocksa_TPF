import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { addresses } from "@rocksa/db/schema";
import { requireAuth, type AuthUser } from "../auth.ts";

export const addressesRouter = new Hono<{ Variables: { user: AuthUser } }>();
addressesRouter.use("*", requireAuth);

const addressBody = z.object({
  country: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postal: z.string().min(1),
  phone: z.string().optional(),
  kind: z.string().optional(),
});

addressesRouter.get("/", async (c) => {
  const user = c.get("user");
  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, user.id));
  return c.json({ addresses: rows });
});

addressesRouter.post("/", async (c) => {
  const user = c.get("user");
  const body = addressBody.parse(await c.req.json());
  const inserted = await db
    .insert(addresses)
    .values({
      userId: user.id,
      country: body.country,
      firstName: body.firstName,
      lastName: body.lastName,
      line1: body.line1,
      line2: body.line2 ?? null,
      city: body.city,
      postal: body.postal,
      phone: body.phone ?? null,
      kind: body.kind ?? "shipping",
    })
    .returning();
  return c.json({ address: inserted[0] });
});

addressesRouter.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
  return c.json({ ok: true });
});
