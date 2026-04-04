/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get admin statistics
 *     description: Retrieves application statistics. Access is restricted to admin users.
 *     tags:
 *       - Stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized. Authentication is required.
 *       403:
 *         description: Forbidden. Admin access is required.
 *       500:
 *         description: Internal server error.
 */
import express from "express";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();

// Admin only stats API
router.get("/", getStats);

export default router;
