import express from "express";
import upload from "../middleware/upload.js";
import { uploadDataset } from "../controllers/dataset.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDataset);

export default router;
