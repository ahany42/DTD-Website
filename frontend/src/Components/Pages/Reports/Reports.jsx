import { Table, IconButton, Button, Dialog, TextArea } from "@radix-ui/themes";
import { CiStar } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Loader from "../../Other/Loader/Loader.jsx";
const Reports = () => {
  const [filter, setFilter] = useState("ALL");
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    message: "",
    reportId: "",
  });
  const { BACKEND_URL } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("DTD_user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setComplaintData((prev) => ({
          ...prev,
          name: parsedUser.name || "",
          email: parsedUser.email || "",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch reports based on current filter
  useEffect(() => {
    if (user?.id) {
      fetchReports(user.id);
    }
  }, [user, filter]); // Re-fetch when user or filter changes

  // Fetch reports based on filter
  const fetchReports = async (userId) => {
    try {
      setLoading(true);

      let url;
      if (filter === "LIKED") {
        // Fetch starred reports
        url = `${BACKEND_URL}/api/reports/starred/${userId}`;
      } else {
        // Fetch all reports
        url = `${BACKEND_URL}/api/reports/user/${userId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      if (data.success) {
        // Add static runtime and format dataset size
        const formattedReports = data.data.map((report) => ({
          ...report,
          runTime: "3m 25s", // Static runtime
          datasetSize: formatFileSize(report.dataSize),
        }));

        setReports(formattedReports);
      } else {
        toast.error(data.message || "Failed to load reports");
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle star status
  const handleStarToggle = async (reportId, isCurrentlyStarred) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reports/star/${reportId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isStarred: !isCurrentlyStarred }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh reports after toggling star
        if (user?.id) {
          fetchReports(user.id);
        }
        toast.success(
          !isCurrentlyStarred ? "Report starred" : "Report unstarred"
        );
      } else {
        toast.error(data.message || "Failed to update star status");
      }
    } catch (error) {
      console.error("Error toggling star:", error);
      toast.error("Failed to update star status");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShowComplaintDialog = (reportId) => {
    setComplaintData((prev) => ({
      ...prev,
      reportId: reportId,
    }));
    setShowComplaintDialog(true);
  };

  const handleComplaintSubmit = async () => {
    try {
      if (!complaintData.message.trim()) {
        toast.warn("Please Enter Complaint Message");
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/complaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("We Have Received your complaint");
        setShowComplaintDialog(false);
        setComplaintData({
          name: user?.name || "",
          email: user?.email || "",
          message: "",
          reportId: "",
        });
      } else {
        toast.error(
          data.message || "Couldn't Send Complaint Please Try Again Later"
        );
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Couldn't Send Complaint Please Try Again Later");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="page">
      <h1 className="title">Reports</h1>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, marginLeft: 60 }}
      >
        <Button
          variant={filter === "ALL" ? "outline" : "soft"}
          onClick={() => setFilter("ALL")}
          aria-label="All Reports Filter"
        >
          All
        </Button>
        <Button
          color="yellow"
          variant={filter === "LIKED" ? "outline" : "soft"}
          onClick={() => setFilter("LIKED")}
          aria-label="Liked Reports Filter"
        >
          Starred
        </Button>
      </div>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell minWidth="100px">
                ID
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell minWidth="200px">
                Created At
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell minWidth="150px">
                Dataset Size
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell minWidth="100px">
                Run Time
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Loader />
                </Table.Cell>
              </Table.Row>
            ) : reports.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {filter === "LIKED"
                    ? "No starred reports found"
                    : "No reports found"}
                </Table.Cell>
              </Table.Row>
            ) : (
              reports.map((report) => (
                <Table.Row key={report._id}>
                  <Table.Cell>{report._id}</Table.Cell>
                  <Table.Cell>{formatDate(report.createdAt)}</Table.Cell>
                  <Table.Cell>{report.datasetSize}</Table.Cell>
                  <Table.Cell>{report.runTime}</Table.Cell>
                  <Table.Cell>
                    <div className="table-icon-container">
                      <IconButton
                        color="green"
                        variant="surface"
                        aria-label="Download report"
                      >
                        <FiDownload />
                      </IconButton>
                      <IconButton
                        color="indigo"
                        variant="surface"
                        aria-label="View report"
                      >
                        <FaEye />
                      </IconButton>
                      <IconButton
                        color="yellow"
                        variant={report.isStarred ? "solid" : "outline"}
                        onClick={() =>
                          handleStarToggle(report._id, report.isStarred)
                        }
                        aria-label={
                          report.isStarred ? "Unstar report" : "Star report"
                        }
                      >
                        <CiStar />
                      </IconButton>
                      <IconButton
                        color="red"
                        variant={report.isComplained ? "solid" : "outline"}
                        onClick={
                          report.isComplained
                            ? () =>
                                toast.info(
                                  "We Have Received Your Complaint Already"
                                )
                            : () => handleShowComplaintDialog(report._id)
                        }
                        aria-label="Report a problem"
                      >
                        <MdOutlineReportProblem />
                      </IconButton>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>

      {/* Complaint Dialog */}
      {showComplaintDialog && (
        <Dialog.Root
          open={showComplaintDialog}
          onOpenChange={setShowComplaintDialog}
        >
          <Dialog.Content>
            <Dialog.Title>Submit Complaint</Dialog.Title>

            <label>Message</label>
            <TextArea
              name="message"
              value={complaintData.message}
              onChange={handleInputChange}
              placeholder="Describe the problem you're experiencing..."
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                onClick={() => setShowComplaintDialog(false)}
                color="red"
                variant="surface"
              >
                Cancel
              </Button>
              <Button
                color="cyan"
                variant="surface"
                onClick={handleComplaintSubmit}
              >
                Submit Complaint
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
};

export default Reports;
