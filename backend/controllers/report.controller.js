// ======================= REPORT CONTROLLER =======================
import mongoose from "mongoose";
import Report from "../models/Report.js";
import User from "../models/User.js";

import puppeteer from "puppeteer";

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
    const { stage } = req.query; // optional query param to specify stage
    const allowedStages = [
      "preprocessing",
      "raw_analysis",
      "clean_analysis",
      "automl_training",
    ];

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

    if (stage) {
      if (!allowedStages.includes(stage)) {
        return res.status(400).json({
          success: false,
          message: `Invalid stage value. Allowed values are: ${allowedStages.join(", ")}`,
        });
      }
      // Return only the requested stage from report.report.stage
      return res.json({
        success: true,
        data: report.report?.[stage] ?? null,
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


// ------------------------------------------ GENERATE REPORT section -----------------------

const formatValue = (value) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "object") {
    return `<pre>${JSON.stringify(value, null, 2)}</pre>`;
  }

  return value;
};

const generateTable = (data) => {
  // If it's an array
  if (Array.isArray(data)) {
    if (data.length === 0) return "<p>No data</p>";

    const headers = Object.keys(data[0]);

    return `
      <table>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join("")}
        </tr>
        ${data.map(row => `
          <tr>
            ${headers.map(h => `<td>${formatValue(row[h])}</td>`).join("")}
          </tr>
        `).join("")}
      </table>
    `;
  }

  // If it's an object
  return `
    <table>
      <tr><th>Key</th><th>Value</th></tr>
      ${Object.entries(data).map(([key, value]) => `
        <tr>
          <td>${key}</td>
          <td>${formatValue(value)}</td>
        </tr>
      `).join("")}
    </table>
  `;
};

const generateSection = (title, data) => {
  if (!data || Object.keys(data).length === 0) {
    return `<h2>${title}</h2><p>No data available</p>`;
  }

  return `
    <h2>${title}</h2>
    ${generateTable(data)}
  `;
};

const renderSection = (title, items) => {
  if (!items || items.length === 0) {
    return `<h3>${title}</h3><p>No data available</p>`;
  }

  return `
    <h3>${title}</h3>
    <table>
      ${items
        .map(
          (item) => `
        <tr>
          <td><b>${item.title}</b></td>
          <td>${formatValue(item.value)}</td>
        </tr>
      `
        )
        .join("")}
    </table>
  `;
};

export const downloadFullReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const reportDoc = await Report.findById(reportId);

    if (!reportDoc) {
      return res.status(404).json({ message: "Report not found" });
    }

    const results = reportDoc.report || {};
    // console.log("FULL REPORT DATA:", JSON.stringify(results.raw_analysis, null, 2));
    const html = `
<html>
<head>
  <style>
    // body {
    //   font-family: Arial;
    //   padding: 40px;
    //   color: #333;
    // }

    h1 {
      text-align: center;
      margin-bottom: 40px;
    }

    h2 {
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
      margin-top: 40px;
    }

    // table {
    //   width: 100%;
    //   border-collapse: collapse;
    //   margin-top: 10px;
    // }

    // td, th {
    //   border: 1px solid #ddd;
    //   padding: 8px;
    // }

    th {
      background: #007bff;
      color: white;
    }

    h2 {
      border-bottom: 2px solid #007bff;
      padding-bottom: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    // th {
    //   background-color: #f5f5f5;
    // }

    .card {
  background: #f8fbff;
  padding: 15px;
  border-radius: 10px;
  border-left: 5px solid #4a90e2;
  margin-bottom: 15px;
  font-size: 14px;
    }

    h3 {
      margin-top: 20px;
      color: #444;
    }

    body {
      font-family: Arial;
      line-height: 1.6;
    }
  </style>
</head>
<body>

<h1>AutoML Report</h1>

<h2>Raw Analysis</h2>
${renderSection("Meta", results.raw_analysis.raw_analysis?.meta ?? [])}
${renderSection("Summary", results.raw_analysis.raw_analysis?.summary ?? [])}
${renderSection("Data Quality", results.raw_analysis.raw_analysis?.data_quality ?? [])}
${renderSection("Target Analysis", results.raw_analysis.raw_analysis?.target_analysis ?? [])}

${generateSection("Preprocessing", results.preprocessing)}
${generateSection("Clean Data", results.clean_analysis)}

<h2>AutoML Results</h2>

<p><b>Best Model:</b> ${results.automl_training.best_model}</p>
<p><b>Accuracy:</b> ${results.automl_training.best_score}</p>

<h3>Models Comparison</h3>
<table>
<tr><th>Model</th><th>Score</th></tr>
${results.automl_training.all_metrics.all_models.map((m, i) => `
  <tr>
    <td>${m}</td>
    <td>${results.automl_training.all_metrics.all_scores[i]}</td>
  </tr>
`).join("")}
</table>
</body>
</html>
`;

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    if (!pdf || pdf.length === 0) {
      throw new Error("PDF generation failed");
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=report_${reportId}.pdf`,
      "Content-Length": pdf.length,
    });

    res.end(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
