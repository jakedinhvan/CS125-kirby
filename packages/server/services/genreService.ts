import { Genre } from "@kirby/types";
import { db } from "..";
import { genresTable, likedGenreTable } from "../src/db/schema";
import { eq } from "drizzle-orm";

export async function getAllGenres(): Promise<Genre[]> {
  const genres = await db.select().from(genresTable);

  return genres;
}

export async function likeGenre(genreId: number) {
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