import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // bytes
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
