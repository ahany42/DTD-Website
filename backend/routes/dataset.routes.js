import express from "express";
import upload from "../middleware/Upload.js";
import {
  uploadDataset,
  runPipeline,
} from "../controllers/dataset.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDataset);
router.post("/run-pipeline", runPipeline);
export default router;
