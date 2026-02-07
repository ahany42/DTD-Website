// ======================= COMPLAINT CONTROLLER =======================
import Complaint from "../models/Complaint.js";

/**
 * Create Complaint
 * Automatically marks the related report as complained
 */
export const createComplaint = async (req, res) => {
  try {
    const { name, email, message, reportId } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id",
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const newComplaint = await Complaint.create({
      name,
      email,
      message,
      reportId,
    });

    // 🔥 mark report as complained ON CREATE
    if (!report.isComplained) {
      report.isComplained = true;
      await report.save();
    }

    res.status(201).json({
      success: true,
      message: "Complaint sent successfully",
      data: newComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create complaint",
      error: error.message,
    });
  }
};

/**
 * Get All Complaints (Admin)
 */
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("reportId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};
