import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isComplained: {
      type: Boolean,
      default: false,
    },
    dataset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset", // Reference to the Dataset model
      required: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    start_time: {
      type: Number,
      default: 0,
    },
    end_time: {
      type: Number,
      default: 0,
    },
    runtime_seconds: {
      type: Number,
      default: 0,
    },
    // flexible structure for future fields
    report: {
      type: Object,
      default: {},
    },
    knowledge_graph: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // gives createdAt automatically
  }
);
ReportSchema.index({ createdAt: -1 });
ReportSchema.index({ userId: 1, createdAt: -1 });
ReportSchema.index({ userId: 1, isStarred: 1, createdAt: -1 });
export default mongoose.model("Report", ReportSchema);
