import { Table } from "@radix-ui/themes";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Loader from "../../Other/Loader/Loader.jsx";
import Pagination from "../../Other/Pagination/Pagination.jsx";

const AdminComplaints = () => {
  const { BACKEND_URL, formatDate } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });

  const token = localStorage.getItem("DTD_token");
  const limit = 10;

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/complaint/complaints?page=${page}&limit=${limit}`,
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
        setComplaints(data.data);
        setPagination({
          page: data.page ?? 1,
          totalPages: data.totalPages ?? 0,
        });
      } else {
        toast.error(data.message || "Failed to load complaints");
        setComplaints([]);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [page]);

  return (
    <div>
      <h1 className="title">Complaints</h1>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto" className="admin-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Message</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Report ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  <Loader />
                </Table.Cell>
              </Table.Row>
            ) : complaints.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No complaints found
                </Table.Cell>
              </Table.Row>
            ) : (
              complaints.map((complaint) => (
                <Table.Row key={complaint._id}>
                  <Table.Cell>{complaint._id}</Table.Cell>
                  <Table.Cell>{complaint.name}</Table.Cell>
                  <Table.Cell>{complaint.email}</Table.Cell>
                  <Table.Cell>{complaint.message}</Table.Cell>
                  <Table.Cell>{complaint.reportId?._id}</Table.Cell>
                  <Table.Cell>{formatDate(complaint.createdAt)}</Table.Cell>
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

export default AdminComplaints;