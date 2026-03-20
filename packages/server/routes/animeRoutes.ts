import { Router } from "express";
import { getAnimeById, getRandomLikedRecommendations, getSimilarToAnime, getSimilarToGenre, resetUserData, searchGenre, searchName, searchNamePersonalized } from "../controllers/animeController";

const router = Router();

router.get("/similar/genre/:id", getSimilarToGenre);
router.get("/similar/anime/:id", getSimilarToAnime);

router.get("/:id", getAnimeById);

router.post("/search/name", searchName);
router.post("/search/name/personalized", searchNamePersonalized);
router.post("/search/genre", searchGenre);
router.get("/recommend/random-liked", getRandomLikedRecommendations);
router.post("/clearUserData", resetUserData);



export default router; 