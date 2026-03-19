import { Router } from "express";
import { getGenres, getLikedGenres, likeGenre } from "../controllers/genreController";

const router = Router();

router.get("/", getGenres);
router.get("/liked", getLikedGenres);
router.post("/like", likeGenre);

export default router;