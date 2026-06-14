import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@rocksa/db";
import { users } from "@rocksa/db/schema";
import { bearerToken, requireAuth, upsertUser, type AuthUser } from "../auth.ts";
import { verifyIdToken } from "../firebase.ts";

export const meRouter = new Hono<{ Variables: { user: AuthUser } }>();

const syncBody = z.object({
  role: z.string().optional(),
  fullName: z.string().nullable().optional(),
});

const profileBody = z.object({
  fullName: z.string().min(1).optional(),
});

meRouter.post("/sync", async (c) => {
  const token = bearerToken(c.req.header("authorization"));
  if (!token) return c.json({ error: "unauthorized" }, 401);
  const decoded = await verifyIdToken(token);
  if (!decoded?.email) return c.json({ error: "invalid token" }, 401);

  try {
    const body = syncBody.safeParse(await c.req.json().catch(() => ({})));
    const user = await upsertUser(
      decoded.uid,
      decoded.email,
      body.success ? (body.data.fullName ?? decoded.name) : decoded.name,
      body.success ? body.data.role : undefined,
    );
    return c.json({ user });
  } catch (e) {
    const code = (e as NodeJS.ErrnoException).code;
    if (code === "ECONNREFUSED") {
      return c.json(
        {
          error: "database_unavailable",
          message:
            "Postgres is not reachable. Start it with: docker compose up -d db && bun run db:migrate",
        },
        503,
      );
    }
    console.error("POST /v1/me/sync error:", e);
    return c.json({ error: "internal_error" }, 500);
  }
});

meRouter.get("/", requireAuth, (c) => c.json({ user: c.get("user") }));

meRouter.patch("/", requireAuth, async (c) => {
  const user = c.get("user");
  const body = profileBody.parse(await c.req.json());
  if (!body.fullName) return c.json({ user });
  const updated = await db
    .update(users)
    .set({ fullName: body.fullName })
    .where(eq(users.id, user.id))
    .returning();
  const row = updated[0]!;
  return c.json({
    user: {
      id: row.id,
      uid: row.firebaseUid,
      email: row.email,
      role: row.role,
      fullName: row.fullName,
    },
  });
});
