import { Request, Response } from "express";
import * as animeService from '../services/animeService';

export async function searchName(req: Request, res: Response): Promise<void> {
  const query: string | undefined = req.body.query;

  if (!query) {
    res.status(400).json( {error: "Query required"});
    return;
  }

  try {
    const results = await animeService.searchByName(query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({
      error: "Search failed",
      details: err.message,
    });
  }
}

export async function searchNamePersonalized(req: Request, res: Response): Promise<void> {
  const query: string | undefined = req.body.query;

  if (!query) {
    res.status(400).json( {error: "Query required"});
    return;
  }

  try {
    const results = await animeService.searchByNamePersonalized(query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({
      error: "Search failed",
      details: err.message,
    });
  }
}

export async function searchGenre(req: Request, res: Response) {
    const query: string | undefined = req.body.query;

    if (!query) {
      res.status(400).json( {error: "Query required"});
      return;
    }

    try {
      const results = await animeService.searchByGenre(query);
      res.json(results);
    } catch (err: any) {
      res.status(500).json({
        error: "Search failed",
        details: err.message,
      });
    }
}

export async function getAnimeById(req: Request, res: Response){
  const id = Number(req.params.id);

  if (!id) {
    res.status(400).json( {error: "ID required in query"});
    return;
  }

  try {
    const results = await animeService.searchById(id);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({
      error: "Search by ID failed",
      details: err.message,
    });
  }
}

export async function getSimilarToGenre(req: Request, res: Response) {
  try {
    const genreId = Number(req.params.id);

    if (isNaN(genreId)) {
      return res.status(400).json({ error: "invalid genreId" });
    }

    const result = await animeService.searchSimilarToGenre(genreId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch similar anime" });
  }
}

export async function getSimilarToAnime(req: Request, res: Response) {
  try {
    const animeId = Number(req.params.id);

    if (!animeId) {
      return res.status(400).json({ error: "invalid animeId" });
    }

    const result = await animeService.searchSimilarToAnime(animeId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to fetch similar anime" });
  }
}