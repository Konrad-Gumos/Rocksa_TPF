import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env.ts";
import { specimensRouter } from "./routes/specimens.ts";
import { cartRouter } from "./routes/cart.ts";
import { ordersRouter } from "./routes/orders.ts";
import { meRouter } from "./routes/me.ts";
import { collectionsRouter } from "./routes/collections.ts";
import { addressesRouter } from "./routes/addresses.ts";
import { workspaceRouter } from "./routes/workspace.ts";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    allowHeaders: ["Authorization", "Content-Type"],
  }),
);

app.get("/health", async (c) => {
  try {
    const { sql } = await import("@rocksa/db");
    await sql`select 1`;
    return c.json({ ok: true, db: true });
  } catch {
    return c.json({ ok: true, db: false }, 503);
  }
});
app.route("/v1/specimens", specimensRouter);
app.route("/v1/cart", cartRouter);
app.route("/v1/orders", ordersRouter);
app.route("/v1/me", meRouter);
app.route("/v1/collections", collectionsRouter);
app.route("/v1/addresses", addressesRouter);
app.route("/v1/workspace", workspaceRouter);

console.log(`api listening on http://localhost:${env.PORT}`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
