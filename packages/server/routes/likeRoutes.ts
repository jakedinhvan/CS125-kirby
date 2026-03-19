import { Router } from "express";
import { getLiked, getLikedAnime, toggleLike } from "../controllers/likeController";

const router = Router();

router.post("/anime/:id", toggleLike);
router.get("/anime", getLikedAnime);
router.get("/", getLiked);

export default router;