import { Table, IconButton, Button } from "@radix-ui/themes";
import { FaThumbsDown } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
const Reports = () => {
  // Temporary mock data (replace with API later)
  const [filter, setFilter] = useState("ALL");
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

  const handleReportProblem = (id) => {
    console.log("Report problem for:", id);
    // later: open modal or send API request
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
          arial-label="All Reports Filter"
        >
          All
        </Button>
        <Button
          color="green"
          variant={filter === "LIKED" ? "outline" : "soft"}
          onClick={() => setFilter("LIKED")}
          arial-label="Liked Reports Filter"
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
                      // onClick={() => handleReportProblem(report.id)}
                      // aria-label="Report a problem"
                    >
                      <FiDownload />
                    </IconButton>
                    <IconButton
                      color="indigo"
                      variant="surface"
                      // onClick={() => handleReportProblem(report.id)}
                      // aria-label="Report a problem"
                    >
                      <FaEye />
                    </IconButton>
                    <IconButton
                      color="green"
                      variant="surface"
                      onClick={() => handleReportProblem(report.id)}
                      aria-label="Report a problem"
                    >
                      <FaThumbsUp />
                    </IconButton>
                    <IconButton
                      color="red"
                      variant="surface"
                      onClick={() => handleReportProblem(report.id)}
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
    </div>
  );
};

export default Reports;
