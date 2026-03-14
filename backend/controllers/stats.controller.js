import Dataset from "../models/Dataset.js";
import User from "../models/User.js";
import Report from "../models/Report.js";
import { formatBytes, formatNumber } from "../utils/utils.js";

export const getStats = async (req, res) => {
  try {
    const totalDatasetsCount = await Dataset.countDocuments();
    const datasetSizeAgg = await Dataset.aggregate([
      { $group: { _id: null, totalSize: { $sum: "$fileSize" } } },
    ]);
    const totalDatasetSizeBytes = datasetSizeAgg[0]?.totalSize || 0;
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const reportRunTimeAgg = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalRunTime: { $sum: "$runtime_seconds" },
        },
      },
    ]);
    const totalRunTimeReports = reportRunTimeAgg[0]?.totalRunTime || 0;

    const totalRunTimeMinutes = totalRunTimeReports / 60;

    const stats = [
      {
        value: formatBytes(totalDatasetSizeBytes),
        label: "Processed Datasets",
      },
      {
        value: formatNumber(totalUsers),
        label: "Users",
      },
      {
        value: formatNumber(totalReports),
        label: "Total Reports",
      },
      {
        value: formatNumber(totalRunTimeMinutes),
        label: "Run Time Minutes",
      },
    ];

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: error.message });
  }
};
