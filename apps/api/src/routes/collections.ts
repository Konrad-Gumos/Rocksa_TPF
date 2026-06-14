import { Hono } from "hono";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@rocksa/db";
import {
  collectionItems,
  collections,
  specimenAttrs,
  specimens,
} from "@rocksa/db/schema";

export const collectionsRouter = new Hono();

const attrsBySpecimenId = async (ids: string[]) => {
  if (ids.length === 0) return new Map<string, Record<string, string>>();
  const rows = await db
    .select()
    .from(specimenAttrs)
    .where(inArray(specimenAttrs.specimenId, ids));
  const map = new Map<string, Record<string, string>>();
  for (const row of rows) {
    const attrs = map.get(row.specimenId) ?? {};
    attrs[row.key] = row.value;
    map.set(row.specimenId, attrs);
  }
  return map;
};

collectionsRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const row = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);
  if (!row[0]) return c.json({ error: "not found" }, 404);

  const links = await db
    .select()
    .from(collectionItems)
    .where(eq(collectionItems.collectionId, row[0].id))
    .orderBy(asc(collectionItems.position));

  const specimenIds = links.map((l) => l.specimenId);
  if (specimenIds.length === 0) return c.json({ items: [] });

  const rows = await db
    .select()
    .from(specimens)
    .where(inArray(specimens.id, specimenIds));
  const attrs = await attrsBySpecimenId(specimenIds);
  const byId = new Map(
    rows.map((specimen) => [
      specimen.id,
      { ...specimen, attributes: attrs.get(specimen.id) ?? {} },
    ]),
  );

  const items = links
    .map((link) => byId.get(link.specimenId))
    .filter((item): item is NonNullable<typeof item> => !!item);

  return c.json({ items });
});
