import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
