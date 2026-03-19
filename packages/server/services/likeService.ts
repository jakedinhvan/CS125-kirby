import { eq } from "drizzle-orm";
import { db } from "..";
import { likedAnimeTable, animeGenresTable, genresTable, animeTable } from "../src/db/schema";

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

export async function getLikedAnime() {
  const rows = await db
    .select({
      id: animeTable.id,
      name: animeTable.name,
      description: animeTable.description,
      seasonYear: animeTable.seasonYear,
      genres: genresTable.name,
    })
    .from(likedAnimeTable)
    .innerJoin(animeTable, eq(likedAnimeTable.animeId, animeTable.id))
    .leftJoin(animeGenresTable, eq(animeTable.id, animeGenresTable.animeId))
    .leftJoin(genresTable, eq(animeGenresTable.genreId, genresTable.id));


  const animeMap = new Map<number, any>();

  for (const row of rows) {
    if (!animeMap.has(row.id)) {
      animeMap.set(row.id, {
        id: row.id,
        name: row.name,
        seasonYear: row.seasonYear,
        description: row.description,
        genres: [],
      });
    }

    if (row.genres) {
      animeMap.get(row.id).genres.push(row.genres);
    }
  }

  return Array.from(animeMap.values());
}
