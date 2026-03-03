import { Request, Response } from "express";
import * as genreService from '../services/genreService';


export async function getGenres(req: Request, res: Response){
  try {
    const allGenres = await genreService.getAllGenres();
    res.json(allGenres);
  } catch (err: any) {
    res.status(500).json({
      error: "Fetch failed",
      details: err.message,
    });
  }
}

export async function likeGenre(req: Request, res: Response) {
  const genreId = Number(req.params.id);

  try {
    const liked = await genreService.likeGenre(genreId);
    res.json({ liked });
  } catch (err: any) {
    res.status(500).json({
      error: "Toggle Genre failed",
      details: err.message,
    });
  }
}

export async function getGenreLiked(req: Request, res: Response) {
  try {
    const liked = await genreService.getGenreLiked();
    res.json(liked);
  } catch (err: any) {
    res.status(500).json({
      error: "Fetch Genre failed",
      details: err.message,
    });
  }
}