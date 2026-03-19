import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getBookmarks, toggleBookmark } from "../controllers/bookmarkController.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getBookmarks);
router.post("/toggle", toggleBookmark);

export default router;
