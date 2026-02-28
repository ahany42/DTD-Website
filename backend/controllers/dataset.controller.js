import Dataset from "../models/Dataset.js";
import Report from "../models/Report.js";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

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
    // datasetUrl = `http://localhost:4000/${dataset.filePath.replace(/\\/g, "/")}`;
    // runPipeline(req, res, datasetUrl, dataset.prompt); // Start the pipeline immediately after upload
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// export const runPipeline = async (req, res, filePath, target_column) => {
//   try {
//     const form = new FormData();

//     // Attach actual CSV file
//     form.append("file", fs.createReadStream(filePath));

//     // Attach metadata
//     form.append("target_column", target_column);
//     form.append("task_type", "classification"); // or dynamic if needed

//     const response = await axios({
//       method: "post",
//       url: "http://127.0.0.1:8000/run-pipeline",
//       data: form,
//       headers: form.getHeaders(),
//       responseType: "stream",
//     });

//     // SSE headers to frontend
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     response.data.on("data", (chunk) => {
//       const lines = chunk.toString().split("\n");

//       for (const line of lines) {
//         if (line.trim().startsWith("data: ")) {
//           res.write(`${line}\n\n`);

//           try {
//             const rawJson = line.replace("data: ", "").trim();
//             const jsonData = JSON.parse(rawJson);
//             if (jsonData.agent) {
//               console.log(`Step Complete: ${jsonData.agent}`);
//               console.log(jsonData.output);
//             }
//           } catch (e) {
//             // Ignore partial chunks
//           }
//         }
//       }
//     });

//     response.data.on("end", () => {
//       res.end();
//     });
//   } catch (error) {
//     res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
//     res.end();
//   }
// };

export const runPipelineStream = async (req, res) => {
  try {
    const datasetId = req.params.id;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // VERY IMPORTANT

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(dataset.filePath));
    form.append("target_column", dataset.prompt);
    form.append("task_type", "classification");

    const response = await axios({
      method: "post",
      url: "http://127.0.0.1:8000/run-pipeline",
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