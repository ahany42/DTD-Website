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
      mode: req.body.mode || "",
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

export const suggestTarget = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    // Prepare form-data to send to FastAPI
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    const response = await axios.post(
      `${AI_BACKEND_URL}/suggest-target`,
      formData,
      {
        headers: formData.getHeaders(),
        maxContentLength: Infinity, // 🔥 prevent size issues
        maxBodyLength: Infinity,
      }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Suggest Target Error:", err);
    return res.status(500).json({
      error: "Failed to get target suggestions",
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
      return res.status(404).json({ error: "Report not found" });
    }
    const targetColumn = report.report?.targetColumn;
    if (!targetColumn) {
      return res
        .status(400)
        .json({ error: "Target column is required but was empty." });
    }

    // ── Dynamic (custom) mode → SSE, emit one event then wait for human ──────
    // Starts the pipeline, emits one SSE event (status: paused|completed|error),
    // then closes the stream. Human resumes via POST /dynamic-resume/:runId.
    if (dataset.mode === "custom") {

      try {
        const form = new FormData();
        const fileStreamResponse = await axios.get(dataset.filePath, { responseType: "stream" });
        form.append("file", fileStreamResponse.data, { filename: dataset.fileName });
        form.append("prompt", dataset.prompt || "");
        form.append("target_column", String(targetColumn));

        // ── Step 1: start the dynamic pipeline ──────────────────────────────
        let aiResponse = await axios.post(
          `${AI_BACKEND_URL}/dynamic/run/${reportId}`,
          form,
          {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
        let state = aiResponse.data;

        // Emit one event with the current state (paused | completed | error)
        // then close the stream — the human decides when to resume via
        // POST /api/dataset/dynamic-resume/:runId
        res.write(
          `data: ${JSON.stringify({
            agent: state.paused_at ?? null,
            status: state.status,
            error: state.error ?? null,
            run_id: state.run_id,
            reportId,
            datasetId,
          })}\n\n`
        );
      } catch (error) {
        res.write(
          `data: ${JSON.stringify({ error: error.response?.data ?? error.message })}\n\n`
        );
      } finally {
        res.end();
      }
      return;
    }

    // ── Static (standard) mode → /run-pipeline/{datasetId}/{reportId} (SSE) ──

    const form = new FormData();
    const fileStreamResponse = await axios.get(dataset.filePath, { responseType: "stream" });
    form.append("file", fileStreamResponse.data, { filename: dataset.fileName });
    form.append("prompt", dataset.prompt || "");
    form.append("mode", dataset.mode);
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
    // If SSE headers were already flushed we can only write an event.
    // Otherwise, send a normal JSON error.
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res
        .status(500)
        .json({ error: error.response?.data || error.message });
    }
  }
};

// ── HITL resume → /dynamic/resume/{runId} ─────────────────────────────────
export const dynamicResume = async (req, res) => {
  try {
    const { runId } = req.params;
    const { decision, feedback_text = "" } = req.body;

    if (!decision) {
      return res.status(400).json({ error: '"decision" is required (accept | feedback)' });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Emit running state immediately so the frontend UI goes to 'running'
    res.write(`data: ${JSON.stringify({ status: "running" })}\n\n`);

    const params = new URLSearchParams({ decision, feedback_text });
    const response = await axios.post(
      `${AI_BACKEND_URL}/dynamic/resume/${runId}`,
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const state = response.data;
    res.write(
      `data: ${JSON.stringify({
        agent: state.paused_at ?? null,
        status: state.status,
        error: state.error ?? null,
        run_id: state.run_id,
      })}\n\n`
    );
  } catch (error) {
    if (res.headersSent) {
      res.write(
        `data: ${JSON.stringify({
          status: "error",
          error: error.response?.data || error.message,
        })}\n\n`
      );
    } else {
      return res.status(500).json({ error: error.response?.data || error.message });
    }
  } finally {
    res.end();
  }
};
