import express from "express";
import {
  createContact,
  getAllContacts,
} from "../controllers/contact.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact messages API
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contacts]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the sender
 *               email:
 *                 type: string
 *                 description: Email of the sender
 *               message:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 contact:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", createContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   message:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/", getAllContacts);

export default router;
