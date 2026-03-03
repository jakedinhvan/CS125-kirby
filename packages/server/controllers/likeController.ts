import { Request, Response } from "express";
import * as likeService from '../services/likeService';

export async function toggleLike(req: Request, res: Response) {
  const animeId = Number(req.params.id);

  try {
    const liked = await likeService.toggleLike(animeId);
    res.json({ liked });
  } catch (err: any) {
    res.status(500).json({
      error: "Toggle failed",
      details: err.message,
    });
  }
}

export async function getLiked(req: Request, res: Response) {
  try {
    const liked = await likeService.getLiked();
    res.json(liked);
  } catch (err: any) {
    res.status(500).json({
      error: "Fetch failed",
      details: err.message,
    });
  }
}


