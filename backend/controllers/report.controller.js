// ======================= REPORT CONTROLLER =======================
import mongoose from "mongoose";
import Report from "../models/Report.js";
import User from "../models/User.js";

import puppeteer from "puppeteer";
import { buildGraph } from "../utils/graphBuilder.js";

/**
 * Create Report
 * report object is empty for now
 */
export const getKnowledgeGraph = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).select(
      "knowledge_graph dynamic_status target_column task_type"
    );

    if (!report) {
      return res.status(404).json({
        error: "Report not found",
      });
    }

    const graph = buildGraph(report.knowledge_graph);

    return res.status(200).json({
      knowledgeGraph: report.knowledge_graph || [],
      dynamicStatus: report.dynamic_status,
      targetColumn: report.target_column,
      taskType: report.task_type,
      graph,
    });
  } catch (error) {
    console.error("Get Knowledge Graph Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [total, reports] = await Promise.all([
      Report.countDocuments({
        userId,
        isStarred: true,
      }),

      Report.find({
        userId,
        isStarred: true,
      })
        .select(
          "_id createdAt start_time end_time runtime_seconds isStarred isComplained dataset"
        )
        .populate({
          path: "dataset",
          select: "fileName fileSize mode",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

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
      message: error.message,
    });
  }
};

// Get sub-node names for a given type in a report
export const getSubNodeNamesByType = async (req, res) => {
  try {
    const { reportId } = req.params;
    // Strip "run_" or "run" prefix so "run_training" resolves to "training"
    const type = req.params.type.replace(/^run_?/, "");

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        error: "Invalid reportId",
      });
    }

    const report = await Report.findById(reportId).select(
      `report.${type}.sub_nodes dynamic_status target_column task_type`
    );

    if (!report) {
      return res.status(404).json({
        error: "Report not found",
      });
    }

    const subNodes = report?.report?.[type]?.sub_nodes;

    // No sub_nodes for this agent — return empty graph (not an error)
    if (!Array.isArray(subNodes) || subNodes.length === 0) {
      return res.status(200).json({
        knowledgeGraph: [],
        graph: { nodes: [], edges: [] },
      });
    }

    // Extract only names
    const names = subNodes.map((node) => node?.name).filter(Boolean);

    // Build graph from names
    const graph = buildGraph(names);

    return res.status(200).json({
      knowledgeGraph: names,
      dynamicStatus: report.dynamic_status,
      targetColumn: report.target_column,
      taskType: report.task_type,
      graph,
    });
  } catch (error) {
    console.error("Get SubNode Names Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// Get full sub-node details for a given type in a report
export const getSubNodeDetails = async (req, res) => {
  try {
    const { reportId, type, name } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({
        error: "Invalid reportId",
      });
    }

    const report = await Report.findById(reportId).select(
      `report.${type}.sub_nodes dynamic_status target_column task_type`
    );

    if (!report) {
      return res.status(404).json({
        error: "Report not found",
      });
    }

    const subNodes = report?.report?.[type]?.sub_nodes;

    if (!Array.isArray(subNodes)) {
      return res.status(404).json({
        error: `No sub_nodes found for '${type}'`,
      });
    }

    const normalizedName = name?.trim().toLowerCase();
    const matchedSubNode = subNodes.find(
      (node) => node?.name?.trim().toLowerCase() === normalizedName
    );

    if (!matchedSubNode) {
      return res.status(404).json({
        error: `No sub_node found with name '${name}' for '${type}'`,
      });
    }

    return res.status(200).json({
      sub_node: matchedSubNode,
      dynamicStatus: report.dynamic_status,
      targetColumn: report.target_column,
      taskType: report.task_type,
    });
  } catch (error) {
    console.error("Get SubNode Details Error:", error);

    return res.status(500).json({
      error: "Internal Server Error",
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
      "eda",
      "raw_analysis",
      "feature_engineering",
      "clean_analysis",
      "model_selection",
      "training",
      "evaluation",
      "deployment",
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
      .populate("dataset", "fileName fileSize mode");

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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [total, reports] = await Promise.all([
      Report.countDocuments({ userId }),

      Report.find({ userId })
        .select(
          "_id createdAt start_time end_time runtime_seconds isStarred isComplained dataset"
        )
        .populate({
          path: "dataset",
          select: "fileName fileSize mode",
          options: { lean: true },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Get All Reports (Admin)
 */
export const getAllReports = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [total, reports] = await Promise.all([
      Report.countDocuments(),

      Report.find()
        .select(
          "_id createdAt start_time end_time runtime_seconds isStarred isComplained dataset userId"
        )
        .populate({
          path: "userId",
          select: "name email",
        })
        .populate({
          path: "dataset",
          select: "fileName fileSize mode",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

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
      message: error.message,
    });
  }
};

/**
 * Toggle Star
 */
export const toggleStarReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id).select("isStarred");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const isStarred = !report.isStarred;

    await Report.updateOne({ _id: id }, { $set: { isStarred } });

    return res.json({
      success: true,
      isStarred,
    });
  } catch (error) {
    return res.status(500).json({
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
          ${headers.map((h) => `<th>${h}</th>`).join("")}
        </tr>
        ${data
          .map(
            (row) => `
          <tr>
            ${headers.map((h) => `<td>${formatValue(row[h])}</td>`).join("")}
          </tr>
        `
          )
          .join("")}
      </table>
    `;
  }

  // If it's an object
  return `
    <table>
      <tr><th>Key</th><th>Value</th></tr>
      ${Object.entries(data)
        .map(
          ([key, value]) => `
        <tr>
          <td>${key}</td>
          <td>${formatValue(value)}</td>
        </tr>
      `
        )
        .join("")}
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
    return `<h2>${title}</h2><p>No data available</p>`;
  }

  return `
    <h3>${title}</h3>
    <table>
      ${items
        .map((item) => {
          // Check if value is an array of {title, value} objects
          if (
            Array.isArray(item.value) &&
            item.value.every(
              (v) => v.title !== undefined && v.value !== undefined
            )
          ) {
            return `
              <tr>
                <td><b>${item.title}</b></td>
                <td>
                  <table>
                    ${item.value.map((v) => `<tr><td>${v.title}</td><td>${v.value}</td></tr>`).join("")}
                  </table>
                </td>
              </tr>
            `;
          } else {
            return `
              <tr>
                <td><b>${item.title}</b></td>
                <td>${formatValue(item.value)}</td>
              </tr>
            `;
          }
        })
        .join("")}
    </table>
  `;
};

const renderPreprocessingSection = (preprocessing) => {
  if (
    !preprocessing ||
    !preprocessing.column_actions ||
    preprocessing.column_actions.length === 0
  ) {
    return `<h2>Preprocessing</h2><p>No data available</p>`;
  }

  return `
    <h2>Preprocessing</h2>
    <table>
      <tr>
        <th>Column</th>
        <th>Action</th>
        <th>Reason</th>
        <th>Details</th>
      </tr>
      ${preprocessing.column_actions
        .map(
          (col) => `
        <tr>
          <td>${col.column}</td>
          <td>${col.action}</td>
          <td>${col.reason}</td>
          <td>
            ${
              col.details
                ? `
              <table style="border:none; width:100%;">
                ${Object.entries(col.details)
                  .map(
                    ([k, v]) =>
                      `<tr><td style="border:none;"><b>${k}</b></td><td style="border:none;">${formatValue(v)}</td></tr>`
                  )
                  .join("")}
              </table>
            `
                : "N/A"
            }
          </td>
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

    const raw =
      results.raw_analysis?.raw_analysis || results.raw_analysis || {};

    const clean =
      results.clean_analysis?.clean_analysis || results.clean_analysis || {};

    const preprocessingHtml = renderPreprocessingSection(results.preprocessing);

    const trainingResults = results.automl_training?.training_results || {};
    const models = trainingResults.all_models || [];
    const scores = trainingResults.all_scores || [];
    const bestModel = trainingResults.best_model || "N/A";
    const bestScore = trainingResults.best_score || "N/A";
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
${renderSection("Meta", raw.meta ?? [])}
${renderSection("Summary", raw.summary ?? [])}
${renderSection("Data Quality", raw.data_quality ?? [])}
${renderSection("Target Analysis", raw.target_analysis ?? [])}

${preprocessingHtml}

<h2>Clean Analysis</h2>

${renderSection("Meta", clean.meta ?? [])}
${renderSection("Summary", clean.summary ?? [])}
${renderSection("Data Quality", clean.data_quality ?? [])}
${renderSection("Target Analysis", clean.target_analysis ?? [])}

<h2>AutoML Results</h2>

<p><b>Best Model:</b> ${bestModel}</p>
<p><b>Accuracy:</b> ${bestScore}</p>


<h3>Models Comparison</h3>
<table>
<tr><th>Model</th><th>Score</th></tr>
${models
  .map(
    (m, i) => `
  <tr>
  <td>${m}</td>
  <td>${scores[i] ?? "N/A"}</td>
  </tr>
  `
  )
  .join("")}
  </table>
  </body>
  </html>
  `;

    // <h2>Raw JSON</h2>
    // <pre style="background:#f0f0f0; padding:10px; border-radius:5px; overflow:auto; font-size:12px;">
    // ${JSON.stringify(reportDoc.report, null, 2)}
    // </pre>
    // console.log("RAW:", raw);
    // console.log("MODELS:", models);
    //   console.log("SCORES:", scores);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdf = await page.pdf({ format: "A4" });
    console.log("PDF size:", pdf.length);

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
