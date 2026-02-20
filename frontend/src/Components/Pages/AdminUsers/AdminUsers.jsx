import { Table } from "@radix-ui/themes";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Loader from "../../Other/Loader/Loader.jsx";

const AdminUsers = () => {
  const { BACKEND_URL, formatDate } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("DTD_token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/auth/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to load users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="title">Users</h1>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto" className="admin-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
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
            ) : users.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={5}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No users found
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{user._id}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default AdminUsers;
