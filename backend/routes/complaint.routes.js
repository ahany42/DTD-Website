import express from "express";
import {
  getAllComplaints,
  createComplaint,
} from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", createComplaint);
router.get("/", getAllComplaints);

export default router;
