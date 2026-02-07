// ======================= REPORT CONTROLLER =======================
import mongoose from "mongoose";
import Report from "../models/Report.js";
import User from "../models/User.js";

/**
 * Create Report
 * report object is empty for now
 */
export const createReport = async (req, res) => {
  try {
    const { userId, report = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newReport = await Report.create({
      userId,
      report,
      isComplained: false,
      isStarred: false,
    });

    res.status(201).json({
      success: true,
      data: newReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create report",
    });
  }
};

/**
 * Get Report By ID
 */
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report id",
      });
    }

    const report = await Report.findById(id).populate("userId", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};

/**
 * Get Reports By User
 */
export const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    const reports = await Report.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

/**
 * Get All Reports (Admin)
 */
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

/**
 * Toggle Star (Admin only usually)
 */
export const toggleStarReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.isStarred = !report.isStarred;
    await report.save();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update report",
    });
  }
};

/**
 * Delete Report
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      message: "Report deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
    });
  }
};
