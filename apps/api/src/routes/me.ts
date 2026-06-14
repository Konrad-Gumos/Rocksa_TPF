import { Hono } from "hono";
import { z } from "zod";
import {
  bearerToken,
  requireAuth,
  upsertUser,
  type AuthUser,
} from "../auth.ts";
import { verifyIdToken } from "../firebase.ts";

export const meRouter = new Hono<{ Variables: { user: AuthUser } }>();

const syncBody = z.object({
  role: z.string().optional(),
  fullName: z.string().nullable().optional(),
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
