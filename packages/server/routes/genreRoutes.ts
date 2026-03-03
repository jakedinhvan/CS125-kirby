import { Router } from "express";
import { getGenres } from "../controllers/genreController";

const router = Router();

router.post("/genres", getGenres);

export default router;