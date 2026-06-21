import express from "express";
import { getGraph } from "../controllers/graph.controller.js";

const router = express.Router();

router.get("/", getGraph);
router.get("/type/:type", getGraph);
export default router;