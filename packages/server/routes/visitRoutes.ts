import { Router } from "express";
import { getVisitedPages, markVisited } from "../controllers/visitController";

const router = Router();

router.get("/", getVisitedPages);
router.post("/anime/:id", markVisited);

export default router;