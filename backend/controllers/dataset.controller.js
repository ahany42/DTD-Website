import Dataset from "../models/Dataset.js";
import Report from "../models/Report.js";
import axios from "axios";

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
      report: {}, // will be filled later
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

export const runPipeline = async (req, res) => {
  const { data_path, target_column } = req.body;

  try {
    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:8000/run-pipeline",
      data: { data_path, target_column },
      responseType: "stream",
    });

    // 1. Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // 2. Handle the stream chunks from Python
    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");

      for (const line of lines) {
        if (line.trim().startsWith("data: ")) {
          // We keep the "data: " prefix so the frontend EventSource can read it
          res.write(`${line}\n\n`);

          // Log to server console for debugging
          try {
            const rawJson = line.replace("data: ", "").trim();
            const jsonData = JSON.parse(rawJson);
            if (jsonData.agent) {
              console.log(`Step Complete: ${jsonData.agent}`);
              console.log(jsonData.output);
            }
          } catch (e) {
            // Ignore partial JSON chunks in server logs
          }
        }
      }
    });

    response.data.on("end", () => {
      res.end();
    });
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};