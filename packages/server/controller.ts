import { Request, Response } from "express";
import { users } from "./testdb"
import { animeGenresTable, animeTable, genresTable } from "./src/db/schema";
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

    try {
        const animeRes = await db
          .select()
          .from(animeTable)
          .where(ilike(animeTable.name, `%${query}%`))
          .limit(20);

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


// Create new user
export async function createUser(req: Request, res: Response) {
  try {
    const { name, likes } = req.body;

    const newUser = {
      name,
      likes,
    };

    users.push(newUser);

    res.status(201).json(newUser);
  } catch (err: any) {
        res.status(500).json({ error: "External API failed", details: err.message });
    }
}

// Add liked anime to user
export async function addLike(req: Request, res: Response) {
  const { name, likeId } = req.body;

  const user = users.find(u => u.name === name);

  if (!user) {
    return res.status(404).json({message: "User not found"});
  }

  if (user.likes.includes(likeId)) {
    return res.status(400).json({message: "Like already exists"});
  }

  user.likes.push(likeId);

  return res.status(200).json(user);
}

// Get all users information
export async function getUsers(req: Request, res: Response) {
  res.json(users);
}