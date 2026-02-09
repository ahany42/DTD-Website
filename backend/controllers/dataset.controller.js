import Dataset from "../models/Dataset.js";

export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataset = await Dataset.create({
      fileName: req.file.originalname,
      fileSize: req.file.size, // always trust backend size
      filePath: req.file.path,
      prompt: req.body.prompt || "",
    });

    res.status(201).json({
      message: "Dataset uploaded successfully",
      dataset,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
