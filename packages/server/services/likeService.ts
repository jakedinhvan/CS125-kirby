import { eq } from "drizzle-orm";
import { db } from "..";
import { likedAnimeTable, likedGenreTable, animeTable } from "../src/db/schema";

export async function toggleLike(animeId: number) {
  const existing = await db
    .select()
    .from(likedAnimeTable)
    .where(eq(likedAnimeTable.animeId, animeId))
    .limit(1);

  if (existing.length) {
    await db
      .delete(likedAnimeTable)
      .where(eq(likedAnimeTable.animeId, animeId));

    return false;
  }

  await db.insert(likedAnimeTable).values({ animeId });

  return true;
}

export async function getLiked() {
  const liked = await db.select().from(likedAnimeTable);

  return liked.map((a) => a.animeId);
}

// return full anime objects for liked items
export async function getLikedAnime() {
  const rows = await db
    .select({ id: animeTable.id, name: animeTable.name })
    .from(likedAnimeTable)
    .innerJoin(animeTable, eq(likedAnimeTable.animeId, animeTable.id));

  return rows.map((r) => ({ id: r.id, name: r.name }));
}
