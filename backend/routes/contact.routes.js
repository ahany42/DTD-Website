import express from "express";
import {
  createContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contact.controller.js";
import { verifyRole } from "../auth.js";
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
router.get("/", verifyRole(["ADMIN"]), getAllContacts);
/**
 * @swagger
 * /contact/change-status/{id}:
 *   patch:
 *     summary: Change contact message status by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Contact ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [RECEIVED, PENDING, REPLIED]
 *                 example: PENDING
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */

router.patch("/change-status/:id", verifyRole(["ADMIN"]), updateContactStatus);

export default router;
