import { Router } from "express";
import { getGenres, getLikedGenres, likeGenre } from "../controllers/genreController";

const router = Router();

router.get("/genres", getGenres);
router.get("/liked-genres", getLikedGenres);
router.post("/like-genre", likeGenre);

export default router;