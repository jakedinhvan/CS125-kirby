import { Request, Response } from "express";
import * as visitService from '../services/visitService';

export async function toggleVisit(req: Request, res: Response) {
  const animeId = Number(req.params.id);

  try {
    const visited = await visitService.toggleVisit(animeId);
    res.json({ visited });
  } catch (err: any) {
    res.status(500).json({
      error: "Toggle failed",
      details: err.message,
    });
  }
}

export async function getVisited(req: Request, res: Response) {
  try {
    const visited = await visitService.getVisited();
    res.json(visited);
  } catch (err: any) {
    res.status(500).json({
      error: "Fetch failed",
      details: err.message,
    });
  }
}

export async function getVisitedPages(req: Request, res: Response) {
  try {
    const visited = await visitService.getVisitedPages();
    res.json(visited);
  } catch (err: any) {
    res.status(500).json({
      error: "Fetch failed",
      details: err.message,
    });
  }
}


