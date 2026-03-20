import { eq } from "drizzle-orm";
import { db } from "..";
import { animeTable, visitedPageTable } from "../src/db/schema";

export async function markVisited(animeId: number) {
  const existing = await db
    .select()
    .from(visitedPageTable)
    .where(eq(visitedPageTable.animeId, animeId))
    .limit(1);

  if (!existing.length) {
    await db.insert(visitedPageTable).values({ animeId });
  }

  return true;
}

export async function getVisited() {
  const visited = await db.select().from(visitedPageTable);

  return visited.map((a) => a.animeId);
}

// return full anime objects for visited pages
export async function getVisitedPages() {
  const rows = await db
    .select({ id: animeTable.id, name: animeTable.name })
    .from(visitedPageTable)
    .innerJoin(animeTable, eq(visitedPageTable.animeId, animeTable.id));

  return rows.map((r) => ({ id: r.id, name: r.name }));
}

export async function clearVisitedPages() {
  await db.delete(visitedPageTable);
}
