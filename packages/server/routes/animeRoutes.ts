import { Router } from "express";
import { getAnimeById, searchGenre, searchName } from "../controllers/animeController";

const router = Router();

router.get("/:id", getAnimeById);
router.post("/search/name", searchName);
router.post("/search/genre", searchGenre);

export default router; 