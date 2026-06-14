import { Hono } from "hono";
import { z } from "zod";
import { db } from "@rocksa/db";
import { auditLog } from "@rocksa/db/schema";

export const inquiriesRouter = new Hono();

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  brief: z.string().min(10),
});

inquiriesRouter.post("/", async (c) => {
  const body = bodySchema.parse(await c.req.json());
  await db.insert(auditLog).values({
    action: "custom_design_inquiry",
    payloadJson: body,
  });
  console.info("[inquiry] custom design:", body);
  return c.json({ ok: true });
});
