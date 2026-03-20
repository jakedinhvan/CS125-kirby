import { eq } from "drizzle-orm";
import { db } from "..";
import { likedAnimeTable, animeGenresTable, genresTable, animeTable, visitedPageTable, likedGenreTable } from "../src/db/schema";

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

  const anime = await db.query.animeTable.findFirst({
    where: (anime, { eq }) => eq(anime.id, animeId),
    with: {
      animeGenres: true,
    },
  });

  const genreValues =
    anime?.animeGenres.map((ag) => ({
      genreId: ag.genreId,
    })) ?? [];

  if (genreValues.length) {
    await db
      .insert(likedGenreTable)
      .values(genreValues)
      .onConflictDoNothing();
  }

  return true;
}

export async function getLiked() {
  const liked = await db.select().from(likedAnimeTable);

  return liked.map((a) => a.animeId);
}

export async function getLikedAnime() {
  const liked = await db.query.likedAnimeTable.findMany({
    with: {
      anime: {
        with: {
          animeGenres: {
            with: {
              genre: true,
            },
          },
        },
      },
    },
  });

  return liked.map((item) => ({
    id: item.anime.id,
    title: item.anime.name,
    description: item.anime.description,
    seasonYear: item.anime.seasonYear,
    genres: [...new Set(item.anime.animeGenres.map((ag) => ag.genre.name))],
  }));
}

export async function clearLikedAnimes() {
  await db.delete(likedAnimeTable);
}