import Dataset from "../models/Dataset.js";
import Report from "../models/Report.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const AI_BACKEND_URL = process.env.AI_BACKEND_URL;
export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create the dataset
    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      fileSize: req.file.size, // always trust backend size
      filePath: req.file.path,
      prompt: req.body.prompt || "",
    });

    // Create a report linked to the dataset
    const report = await Report.create({
      userId: req.body.userId, // make sure frontend sends userId
      dataset: dataset._id,
      isComplained: false,
      isStarred: false,
      report: { targetColumn: req.body.targetColumn || null }, // will be filled later
    });

    res.status(201).json({
      message: "Dataset uploaded and report created successfully",
      dataset,
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

export const runPipelineStream = async (req, res) => {
  try {
    const datasetId = req.params.datasetId;
    const reportId = req.params.reportId;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // VERY IMPORTANT

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    const report = await Report.findById(reportId);
    if (!report) {
      res.write(`data: ${JSON.stringify({ error: "Report not found" })}\n\n`);
      return res.end();
    }
    const targetColumn = report.report?.targetColumn;
    if (!targetColumn) {
      res.write(
        `data: ${JSON.stringify({ error: "Target column is required but was empty." })}\n\n`
      );
      return res.end();
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(dataset.filePath));
    // form.append("target_column", dataset.prompt);
    form.append("target_column", String(targetColumn));

    const response = await axios({
      method: "post",
      url: `${AI_BACKEND_URL}/run-pipeline/${datasetId}/${reportId}`,
      data: form,
      headers: form.getHeaders(),
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      res.write(chunk.toString());
    });

    response.data.on("end", () => {
      res.end();
    });
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
