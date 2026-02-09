import Dataset from "../models/dataset.js";
import Report from "../models/Report.js";
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
      dataSize: dataset.fileSize,
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
