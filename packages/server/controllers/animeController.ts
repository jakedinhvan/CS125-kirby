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