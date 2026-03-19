import { Router } from "express";
import { getAnimeById, getSimilarToAnime, getSimilarToGenre, searchGenre, searchName, searchNamePersonalized } from "../controllers/animeController";

const router = Router();

router.get("/similar/genre/:id", getSimilarToGenre);
router.get("/similar/anime/:id", getSimilarToAnime);

router.get("/:id", getAnimeById);

router.post("/search/name", searchName);
router.post("/search/name/personalized", searchNamePersonalized);
router.post("/search/genre", searchGenre);




export default router; 