/**
 * @swagger
 * tags:
 *   name: Dataset
 *   description: Dataset upload and pipeline execution endpoints
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a dataset file
 *     description: Uploads a dataset file using multipart/form-data.
 *     tags: [Dataset]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The dataset file to upload
 *     responses:
 *       200:
 *         description: Dataset uploaded successfully
 *       400:
 *         description: Invalid request or missing file
 *       500:
 *         description: Server error while uploading dataset
 */

/**
 * @swagger
 * /run-pipeline/{datasetId}/{reportId}:
 *   get:
 *     summary: Run the dataset processing pipeline
 *     description: Starts the pipeline for the specified dataset and report.
 *     tags: [Dataset]
 *     parameters:
 *       - in: path
 *         name: datasetId
 *         required: true
 *         description: Unique identifier of the dataset
 *         schema:
 *           type: string
 *       - in: path
 *         name: reportId
 *         required: true
 *         description: Unique identifier of the report
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pipeline started successfully
 *       400:
 *         description: Invalid datasetId or reportId
 *       404:
 *         description: Dataset or report not found
 *       500:
 *         description: Server error while running the pipeline
 */
import express from "express";
import upload from "../middleware/Upload.js";
import multer from "multer";
import {
  uploadDataset,
  // runPipeline,
  suggestTarget,
  runPipelineStream,
  dynamicResume,
} from "../controllers/dataset.controller.js";

const router = express.Router();

// diskStorage for uploadDataset
router.post("/upload", upload.single("file"), uploadDataset);
// router.post("/run-pipeline", runPipeline);
// memoryStorage for suggest-target
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });
router.post("/suggest-target", uploadMemory.single("file"), suggestTarget);
router.get("/run-pipeline/:datasetId/:reportId", runPipelineStream);
router.post("/dynamic-resume/:runId", dynamicResume);

export default router;
