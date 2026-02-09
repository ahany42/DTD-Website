import express from "express";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();

// Admin only stats API
router.get("/", getStats);

export default router;
