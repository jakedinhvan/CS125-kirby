import { Request, Response } from "express";
import { animeGenresTable, animeTable, genresTable, likedAnimeTable } from "./src/db/schema";
import { eq, ilike } from "drizzle-orm";
import { db } from ".";

// Search anime by name
export async function searchName(req: Request, res: Response): Promise<void> {
    const query: string | undefined = req.body.query;

    console.log("Received body:", req.body);

    if (!query) {
      res.status(400).json( {error: "Query required"});
      return;
    }

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
      })
      .from(animeTable)
      .leftJoin(
        animeGenresTable,
        eq(animeTable.id, animeGenresTable.animeId)
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
    }

    const animeRes = Array.from(grouped.values()).sort((a, b) => {
      return b.matchScore - a.matchScore;
    });

    try {
        res.json( //@todo: do this better
          animeRes.map((a) => ({
            id: a.id,
            title: {
              romaji: a.name,
              english: a.name,
              native: a.name,
            },
            seasonYear: a.seasonYear,
            genres: [],
            description: a.description,
          }))
        );
    } catch (err: any) {
        res.status(500).json({ error: "External API failed", details: err.message });
    }
}

// Search anime by gemre
export async function searchGenre(req: Request, res: Response) {
    const query: string | undefined = req.body.query;

    if (!query) {
      res.status(400).json( {error: "Query required"});
      return;
    }

    console.log("Genre: ", query);

    try {
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

      res.json(
        rows.map((a) => ({
          id: a.id,
          title: {
            romaji: a.name,
            english: a.name,
            native: a.name,
          },
          seasonYear: a.seasonYear,
          genres: [query], 
          description: a.description,
        }))
      );
    } catch (err: any) {
      res.status(500).json({
        error: "Database query failed",
        details: err.message,
      });
    }
}

// Add liked anime to user
export async function toggleLike(req: Request, res: Response) {
  const animeId = Number(req.params.id);

  const existing = await db
    .select()
    .from(likedAnimeTable)
    .where(eq(likedAnimeTable.animeId, animeId))
    .limit(1);

  if (existing.length) {
    await db
      .delete(likedAnimeTable)
      .where(eq(likedAnimeTable.animeId, animeId));

    return res.json({ liked: false });
  }

  await db.insert(likedAnimeTable).values({ animeId });

  res.json({ liked: true });
}

export async function getLiked(req: Request, res: Response) {
  const liked = await db.select().from(likedAnimeTable);

  res.json(liked.map((a) => a.animeId));
}
