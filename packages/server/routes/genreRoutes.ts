import { Router } from "express";
import { getGenres, likeGenre } from "../controllers/genreController";

const router = Router();

router.get("/genres", getGenres);
router.post("/like-genre", likeGenre);

export default router;