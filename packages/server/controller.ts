import axios from "axios";
import { Request, Response } from "express";
import type { Anime } from '@kirby/types';

interface AnilistResponse<T> {
  data: {
    Page: {
      media: T[];
    };
  };
}

// Search anime by name
export async function searchName(req: Request, res: Response): Promise<void> {
    const query: string | undefined = req.body.query;

    console.log("Received body:", req.body);

    if (!query) {
      res.status(400).json( {error: "Query required"});
      return;
    }

    const graphqlQuery = `
        query ($search: String) {
            Page(page: 1, perPage: 5) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                  native
                }
                seasonYear
                genres
                description
              }
            }
        }`;

    try {
        const response = await axios.post<AnilistResponse<Anime>>(
            "https://graphql.anilist.co",
            { query: graphqlQuery, variables: { search: query } },
            { headers: { "Content-Type": "application/json" } }
        );

        const animeRes: Anime[] = response.data.data.Page.media;
        res.json(animeRes);
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

    const graphqlQuery = `
        query ($genre: String) {
            Page(page: 1, perPage: 5) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(genre_in: [$genre], type: ANIME) {
                id
                title {
                  romaji
                  english
                  native
                }
                seasonYear
                genres
                description
              }
            }
        }`;

    try {
        const response = await axios.post<AnilistResponse<Anime>>(
            "https://graphql.anilist.co",
            { query: graphqlQuery, variables: { genre: query } },
            { headers: { "Content-Type": "application/json" } }
        );

        const animeRes: Anime[] = response.data.data.Page.media;
        res.json(animeRes);
    } catch (err: any) {
        res.status(500).json({ error: "External API failed", details: err.message });
    }
}