import { Table, Badge } from "@radix-ui/themes";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Loader from "../../Other/Loader/Loader.jsx";
import Pagination from "../../Other/Pagination/Pagination.jsx";

const AdminReports = () => {
  const { BACKEND_URL, formatDate } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });

  const token = localStorage.getItem("DTD_token");
  const limit = 10;

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/reports/?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
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

  useEffect(() => {
    fetchReports();
  }, [page]);

  return (
    <div>
      <h1 className="title">Reports</h1>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto" className="admin-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Dataset</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Data Size</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Complained</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Starred</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={8}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Loader />
                </Table.Cell>
              </Table.Row>
            ) : reports.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No reports found
                </Table.Cell>
              </Table.Row>
            ) : (
              reports.map((report) => (
                <Table.Row key={report._id}>
                  <Table.Cell>{report._id}</Table.Cell>
                  <Table.Cell>{report.userId?.name}</Table.Cell>
                  <Table.Cell>{report.userId?.email}</Table.Cell>
                  <Table.Cell>{report.dataset?.fileName}</Table.Cell>
                  <Table.Cell>{report.dataset?.fileSize}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="soft"
                      color={report.isComplained ? "red" : "green"}
                    >
                      {report.isComplained ? "Yes" : "No"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      variant="soft"
                      color={report.isStarred ? "yellow" : "green"}
                    >
                      {report.isStarred ? "Yes" : "No"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatDate(report.createdAt)}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default AdminReports;
