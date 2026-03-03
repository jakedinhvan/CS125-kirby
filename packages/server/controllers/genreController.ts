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