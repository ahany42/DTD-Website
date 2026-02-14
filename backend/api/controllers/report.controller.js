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
 * Get Starred Reports By User
 */
export const getStarredReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

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

    // pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Report.countDocuments({ userId, isStarred: true });

    const starredReports = await Report.find({
      userId,
      isStarred: true,
    })
      .populate("dataset", "fileName fileSize")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: starredReports,
    });
  } catch (error) {
    console.error("Error fetching starred reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch starred reports",
      error: error.message,
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

    const report = await Report.findById(id)
      .populate("userId", "name email")
      .populate("dataset", "fileName fileSize");

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

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 items per page
    const skip = (page - 1) * limit;

    // Get total count for the user
    const total = await Report.countDocuments({ userId });

    const reports = await Report.find({ userId })
      .populate("dataset", "fileName fileSize")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

/**
 * Get All Reports (Admin)
 */
export const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Report.countDocuments();

    const reports = await Report.find()
      .populate("userId", "name email")
      .populate("dataset", "fileName fileSize")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

/**
 * Toggle Star
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
      message: error.message,
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
