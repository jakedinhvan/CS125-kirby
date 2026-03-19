import { eq, ilike } from "drizzle-orm";
import { db } from "..";
import { animeGenresTable, animeTable, genresTable, likedAnimeTable, visitedPageTable, likedGenreTable } from "../src/db/schema";
import { Anime } from "@kirby/types";

export async function searchByNamePersonalized(query: string) {
  const likedGenres = await db
    .select({ genreId: animeGenresTable.genreId })
    .from(likedAnimeTable)
    .innerJoin(
      animeGenresTable,
      eq(likedAnimeTable.animeId, animeGenresTable.animeId)
    );

  const likedGenreIds = new Set(likedGenres.map(g => g.genreId));

  const animeList = await db.query.animeTable.findMany({
    where: (anime, { ilike }) => ilike(anime.name, `%${query}%`),
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
    },
    limit: 50,
  });

  const scored = animeList.map((anime) => {
    let matchScore = 0;

    const genreIds = new Set(anime.animeGenres.map(ag => ag.genreId));

    for (const genreId of genreIds) {
      if (likedGenreIds.has(genreId)) {
        matchScore++;
      }
    }

    return {
      id: anime.id,
      title: anime.name,
      seasonYear: anime.seasonYear,
      description: anime.description,
      genres: [...new Set(anime.animeGenres.map((ag) => ag.genre.name))],
      matchScore,
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  return scored;      
}

export async function searchByName(query: string) {    
  const animeList = await db.query.animeTable.findMany({
    where: (anime, { ilike }) => ilike(anime.name, `%${query}%`),
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
    },
    limit: 50,
  });

  return animeList.map((anime) => ({
    id: anime.id,
    title: anime.name,
    seasonYear: anime.seasonYear,
    description: anime.description,
    genres: [...new Set(anime.animeGenres.map((ag) => ag.genre.name))],
  }));
}

export async function searchByGenre(query: string) {
  const animeList = await db.query.animeTable.findMany({
    with: {
      animeGenres: {
        with: {
          genre: true,
        },
      },
    },
    limit: 50,
  });

  return animeList
    .filter((anime) =>
      anime.animeGenres.some((ag) =>
        ag.genre.name.toLowerCase().includes(query.toLowerCase())
      )
    )
    .map((anime) => ({
      id: anime.id,
      title: anime.name,
      seasonYear: anime.seasonYear,
      description: anime.description,
      genres: [...new Set(anime.animeGenres.map((ag) => ag.genre.name))],
    }));
}

export async function searchById(id: number): Promise<Anime | null> {
  const anime = await db.query.animeTable.findFirst({
    where: (anime, { eq }) => eq(anime.id, id),
    with: {
      animeGenres: {
        with: {
          genre: true,
        }
      }
    }
  });

  if (!anime) return null;

  return {
    id: anime.id,
    title: anime.name,
    seasonYear: anime.seasonYear || 1800,
    description: anime.description,
    genres: [...new Set(anime.animeGenres.map((ag) => ag.genre.name))],
  }
}