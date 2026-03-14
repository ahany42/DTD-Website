import { Table, IconButton, Button, Dialog, TextArea } from "@radix-ui/themes";
import { CiStar } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Pagination from "../../Other/Pagination/Pagination.jsx";
import Loader from "../../Other/Loader/Loader.jsx";
const Reports = () => {
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    message: "",
    reportId: "",
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const { BACKEND_URL, formatFileSize, formatDate } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 15;
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
  }, [user, filter, page]); // Re-fetch when user or filter changes

  // Fetch reports based on filter
  const fetchReports = async (userId) => {
    try {
      let url;
      if (filter === "STARRED") {
        // Fetch starred reports
        url = `${BACKEND_URL}/api/reports/starred/${userId}?limit=${limit}&page=${page}`;
      } else {
        // Fetch all reports
        url = `${BACKEND_URL}/api/reports/user/${userId}?limit=${limit}&page=${page}`;
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
        }));

        setReports(formattedReports);
        setPagination({
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 0,
        });
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
  const viewReport = (id) => {
    if (!id) {
      toast.info("Your report is being generated");
    } else {
      navigate(`/view-report/${id}`);
    }
  };
  // const downLoadReport = (report) => {
  //   if (!report) {
  //     toast.info("Your report is being generated");
  //   }
  //   //TODO:Generate the pdf on spot
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSetFilter = (newFilter) => {
    if (filter !== newFilter) {
      setFilter(newFilter);
      setPage(1);
    }
  };
  return (
    <div className="page">
      <h1 className="title">Reports</h1>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, marginLeft: 60 }}
      >
        <Button
          variant={filter === "ALL" ? "outline" : "soft"}
          onClick={() => handleSetFilter("ALL")}
          aria-label="All Reports Filter"
        >
          All
        </Button>
        <Button
          color="yellow"
          variant={filter === "STARRED" ? "outline" : "soft"}
          onClick={() => handleSetFilter("STARRED")}
          aria-label="Stared Reports Filter"
        >
          Starred
        </Button>
      </div>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto" className="admin-table">
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
              <Table.ColumnHeaderCell minWidth="150px">
                Dataset Name
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
                  {filter === "STARRED"
                    ? "No starred reports found"
                    : "No reports found"}
                </Table.Cell>
              </Table.Row>
            ) : (
              reports.map((report) => (
                <Table.Row key={report._id}>
                  <Table.Cell>{report._id}</Table.Cell>
                  <Table.Cell>{formatDate(report.createdAt)}</Table.Cell>
                  <Table.Cell>
                    {formatFileSize(report.dataset.fileSize)}
                  </Table.Cell>
                  <Table.Cell>{report.dataset.fileName}</Table.Cell>
                  <Table.Cell>{report.runTime}</Table.Cell>
                  <Table.Cell>
                    <div className="table-icon-container">
                      {/* <IconButton
                        color="green"
                        variant="surface"
                        onClick={() => downLoadReport(report.report)}
                        aria-label="Download report"
                      >
                        <FiDownload />
                      </IconButton> */}
                      <IconButton
                        color="green"
                        variant="surface"
                        onClick={() => viewReport(report._id)}
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
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default Reports;
