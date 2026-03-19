import { eq, ilike } from "drizzle-orm";
import { db } from "..";
import { animeGenresTable, animeTable, genresTable, likedAnimeTable, visitedPageTable, likedGenreTable } from "../src/db/schema";
import { Anime } from "@kirby/types";

export async function searchByNamePersonalized(query: string) {
    // gets all liked genres (from their anime likes)
    const likedGenres = await db
      .select({ genreId: animeGenresTable.genreId })
      .from(likedAnimeTable)
      .innerJoin(
        animeGenresTable,
        eq(likedAnimeTable.animeId, animeGenresTable.animeId)
      );

    const likedGenreIds = [
      ...new Set(likedGenres.map(g => g.genreId))
    ];

    // gets all user liked genres
    const userLikedGenres = await db
      .select({ genreId: likedGenreTable.genreId })
      .from(likedGenreTable);

    const userLikedGenreIds = [
      ...new Set(userLikedGenres.map(g => g.genreId))
    ];

    // gets all genres of visited anime pages
    const visitedGenres = await db
      .select({ genreId: animeGenresTable.genreId })
      .from(visitedPageTable)
      .innerJoin(
        animeGenresTable,
        eq(visitedPageTable.animeId, animeGenresTable.animeId)
      );

    const visitedGenreIds = [
      ...new Set(visitedGenres.map(g => g.genreId))
    ];

    // gets all of only the search query
    const animeSearch = await db
      .select({
        id: animeTable.id,
        name: animeTable.name,
        seasonYear: animeTable.seasonYear,
        description: animeTable.description,
        genreId: animeGenresTable.genreId,
        genreName: genresTable.name,
      })
      .from(animeTable)
      .leftJoin(
        animeGenresTable,
        eq(animeTable.id, animeGenresTable.animeId)
      )
      .leftJoin(
        genresTable,
        eq(animeGenresTable.genreId, genresTable.id)
      )
      .where(ilike(animeTable.name, `%${query}%`))
      .limit(50); // larger pool for better scoring

    const grouped = new Map<number, any>();

    // combines like info and search info
    for (const row of animeSearch) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, {
          id: row.id,
          name: row.name,
          seasonYear: row.seasonYear,
          description: row.description,
          genreIds: [],
          genres: [],
          matchScore: 0,
        });
      }

      const anime = grouped.get(row.id);

      // weighing
      // user liked genre: 3 pt; user liked anime: 2 pt; visited page: 1 pt
      if (row.genreId) {
        anime.genreIds.push(row.genreId);

        if (userLikedGenreIds.includes(row.genreId)) {
          anime.matchScore += 3; // increment per shared genre
        } else if (likedGenreIds.includes(row.genreId)) {
          anime.matchScore += 2;
        } else if (visitedGenreIds.includes(row.genreId)) {
          anime.matchScore += 1;
        }
      }

      if (row.genreName && !anime.genres.includes(row.genreName)) {
        anime.genres.push(row.genreName);
      }
    }

    const animeRes = Array.from(grouped.values()).sort((a, b) => {
      return b.matchScore - a.matchScore;
    });

    return animeRes.map((a) => ({
      id: a.id,
      title: a.name,
      seasonYear: a.seasonYear,
      genres: a.genres,
      description: a.description,
    }));        
}

export async function searchByName(query: string) {
    // gets all of only the search query
    const animeSearch = await db
      .select({
        id: animeTable.id,
        name: animeTable.name,
        seasonYear: animeTable.seasonYear,
        description: animeTable.description,
        genreId: animeGenresTable.genreId,
        genreName: genresTable.name,
      })
      .from(animeTable)
      .leftJoin(
        animeGenresTable,
        eq(animeTable.id, animeGenresTable.animeId)
      )
      .leftJoin(
        genresTable,
        eq(animeGenresTable.genreId, genresTable.id)
      )
      .where(ilike(animeTable.name, `%${query}%`))
      .limit(50); // larger pool for better scoring


    const grouped = new Map<number, any>();
    // combines like info and search info
    for (const row of animeSearch) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, {
          id: row.id,
          name: row.name,
          seasonYear: row.seasonYear,
          description: row.description,
          genreIds: [],
          genres: [],
        });
      }

      const anime = grouped.get(row.id);

      // adding to genreId + genres
      if (row.genreId) {
        anime.genreIds.push(row.genreId);
      }

      if (row.genreName && !anime.genres.includes(row.genreName)) {
        anime.genres.push(row.genreName);
      }
    }

    const animeRes = Array.from(grouped.values());


    return animeRes.map((a) => ({
        id: a.id,
        title: a.name,
        seasonYear: a.seasonYear,
        genres: a.genres,
        description: a.description,
      }));
}

export async function searchByGenre(query: string) {
  const rows = await db //@todo: do this better
    .select({
      id: animeTable.id,
      name: animeTable.name,
      seasonYear: animeTable.seasonYear,
      description: animeTable.description,
    })
    .from(animeTable)
    .innerJoin(
      animeGenresTable,
      eq(animeTable.id, animeGenresTable.animeId)
    )
    .innerJoin(
      genresTable,
      eq(animeGenresTable.genreId, genresTable.id)
    )
    .where(ilike(genresTable.name, `%${query}%`))
    .limit(20);

  return rows.map((a) => ({
    id: a.id,
    title: a.name,
    seasonYear: a.seasonYear,
    genres: [query], 
    description: a.description,
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
    genres: anime.animeGenres.map((ag) => ag.genre.name),
  }
}