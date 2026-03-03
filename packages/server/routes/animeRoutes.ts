import { Router } from "express";
import { searchGenre, searchName } from "../controllers/animeController";
import { getLiked, toggleLike } from "../controllers/likeController";

const router = Router();

router.post("/searchname", searchName);
router.post("/searchgenre", searchGenre);
router.post("/:id/like", toggleLike);
router.get("/liked", getLiked);

export default router; 