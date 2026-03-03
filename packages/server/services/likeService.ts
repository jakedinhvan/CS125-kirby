import { eq } from "drizzle-orm";
import { db } from "..";
import { likedAnimeTable, likedGenreTable } from "../src/db/schema";

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

export async function toggleGenreLike(genreId: number) {
  const existing = await db
    .select()
    .from(likedGenreTable)
    .where(eq(likedGenreTable.genreId, genreId))
    .limit(1);

  if (existing.length) {
    await db
      .delete(likedGenreTable)
      .where(eq(likedGenreTable.genreId, genreId));

    return false;
  }

  await db.insert(likedGenreTable).values({ genreId });

  return true;

}

export async function getGenreLiked() {
  const liked = await db.select().from(likedGenreTable);

  return liked.map((g) => g.genreId);
}