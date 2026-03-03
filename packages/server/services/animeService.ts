import { eq, ilike } from "drizzle-orm";
import { db } from "..";
import { animeGenresTable, animeTable, genresTable, likedAnimeTable } from "../src/db/schema";

export async function searchByName(query: string) {
    // gets all liked genres
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
      if (row.genreId) {
        anime.genreIds.push(row.genreId);

        if (likedGenreIds.includes(row.genreId)) {
          anime.matchScore += 1; // increment per shared genre
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
      title: {
        romaji: a.name,
        english: a.name,
        native: a.name,
      },
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
    title: {
      romaji: a.name,
      english: a.name,
      native: a.name,
    },
    seasonYear: a.seasonYear,
    genres: [query], 
    description: a.description,
  }));
}