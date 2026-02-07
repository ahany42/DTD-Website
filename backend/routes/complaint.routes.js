import express from "express";
import {
  getAllComplaints,
  createComplaint,
} from "../controllers/complaint.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: API for managing complaints
 */

/**
 * @swagger
 * /complaint:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *               - reportId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user submitting the complaint
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               message:
 *                 type: string
 *                 description: Complaint message
 *               reportId:
 *                 type: string
 *                 description: ID of the related report
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 complaint:
 *                   $ref: '#/components/schemas/Complaint'
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /complaint:
 *   get:
 *     summary: Get all complaints
 *     tags: [Complaints]
 *     responses:
 *       200:
 *         description: List of complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Complaint'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Complaint:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the complaint
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         message:
 *           type: string
 *         reportId:
 *           type: string
 *           description: ID of the related report
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.post("/", createComplaint);
router.get("/", getAllComplaints);

export default router;
