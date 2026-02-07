import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dataSize: {
      type: Number,
      default: 0,
    },
    isComplained: {
      type: Boolean,
      default: false,
    },

    isStarred: {
      type: Boolean,
      default: false,
    },

    // flexible structure for future fields
    report: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, // gives createdAt automatically
  }
);

export default mongoose.model("Report", ReportSchema);
