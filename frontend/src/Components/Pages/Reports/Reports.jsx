import {
  Table,
  IconButton,
  Button,
  Dialog,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { FaThumbsDown, FaThumbsUp, FaEye } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Reports = () => {
  const [filter, setFilter] = useState("ALL");
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [complaintData, setComplaintData] = useState({
    name: "",
    email: "",
    message: "",
    reportId: "",
  });
  const [user, setUser] = useState(null);

  const reports = [
    {
      id: "REP-001",
      createdAt: "2026-02-05 12:30",
      datasetSize: "120 MB",
      runTime: "3m 25s",
    },
    {
      id: "REP-002",
      createdAt: "2026-02-05 14:10",
      datasetSize: "2.4 GB",
      runTime: "12m 05s",
    },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
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

      const response = await fetch("http://localhost:4000/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        toast.success("We Have Received your complain");

        setShowComplaintDialog(false);
        setComplaintData({
          name: user?.name || "",
          email: user?.email || "",
          message: "",
          reportId: "",
        });
      } else {
        throw new Error("Failed to submit complaint");
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
          color="green"
          variant={filter === "LIKED" ? "outline" : "soft"}
          onClick={() => setFilter("LIKED")}
          aria-label="Liked Reports Filter"
        >
          Liked
        </Button>
      </div>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell minWidth="100px">
                ID
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell minWidth="150px">
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
            {reports.map((report) => (
              <Table.Row key={report.id}>
                <Table.Cell>{report.id}</Table.Cell>
                <Table.Cell>{report.createdAt}</Table.Cell>
                <Table.Cell>{report.datasetSize}</Table.Cell>
                <Table.Cell>{report.runTime}</Table.Cell>
                <Table.Cell>
                  <div className="table-icon-container">
                    <IconButton
                      color="indigo"
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
                      color="green"
                      variant="surface"
                      aria-label="Like"
                    >
                      <FaThumbsUp />
                    </IconButton>
                    <IconButton
                      color="red"
                      variant="surface"
                      onClick={() => handleShowComplaintDialog(report.id)}
                      aria-label="Report a problem"
                    >
                      <FaThumbsDown />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      {/* Complaint Dialog - Using same pattern as ProductsAdmin */}
      {showComplaintDialog && (
        <Dialog.Root
          open={showComplaintDialog}
          onOpenChange={setShowComplaintDialog}
        >
          <Dialog.Content style={{ maxWidth: 500 }}>
            <Dialog.Title>Submit Complaint</Dialog.Title>

            <div className="input-label-container">
              <label>Message</label>
              <TextArea
                name="message"
                value={complaintData.message}
                onChange={handleInputChange}
                placeholder="Describe the problem you're experiencing..."
              />
            </div>

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
