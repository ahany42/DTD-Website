// routes/reportRoutes.js
import express from "express";
import {
  createReport,
  getReportById,
  getReportsByUser,
  getAllReports,
  getKnowledgeGraph,
  getSubNodeNamesByType,
  toggleStarReport,
  deleteReport,
  getStarredReportsByUser,
  downloadFullReport,
} from "../controllers/report.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               report:
 *                 type: object
 *                 description: Report data (empty object for now)
 *             required:
 *               - userId
 *     responses:
 *       201:
 *         description: Report created
 */
router.get("/:reportId/knowledge-graph", getKnowledgeGraph);
router.get("/:reportId/knowledge-graph/:type", getSubNodeNamesByType);
router.post("/", createReport);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report object
 */
router.get("/:id", getReportById);

/**
 * @swagger
 * /reports/user/{userId}:
 *   get:
 *     summary: Get all reports for a specific user
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get("/user/:userId", getReportsByUser);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of all reports
 */
router.get("/", getAllReports);

/**
 * @swagger
 * /reports/star/{id}:
 *   patch:
 *     summary: Toggle star on a report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Updated report
 */
router.patch("/star/:id", toggleStarReport);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted
 */
router.delete("/:id", deleteReport);

/**
 * @swagger
 * /reports/starred/{userId}:
 *   get:
 *     summary: Get all reports for a specific user
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get("/starred/:userId", getStarredReportsByUser);

/**
 * @swagger
 * /reports/{reportId}/download:
 *   get:
 *     summary: Download full AutoML report as PDF
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         schema:
 *           type: string
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: PDF file download
 */
router.get("/:reportId/download", downloadFullReport);

export default router;
