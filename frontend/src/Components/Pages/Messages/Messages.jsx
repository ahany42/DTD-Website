import { Table, Select } from "@radix-ui/themes";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import Loader from "../../Other/Loader/Loader.jsx";

const Messages = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("DTD_token"); // get token from localStorage
  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // pass the token here
          "Cache-Control": "no-cache", // optional: prevent 304 Not Modified
        },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      } else {
        toast.error(data.message || "Failed to load messages");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Update status
  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/contact/change-status/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // pass the token here
            "Cache-Control": "no-cache", // optional: prevent 304 Not Modified
          },
          body: JSON.stringify({
            status: newStatus, // ✅ send status here
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Status updated successfully");
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId ? { ...msg, status: newStatus } : msg
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1 className="title">Contact Messages</h1>

      <div className="table-scroll-wrapper">
        <Table.Root variant="surface" layout="auto" className="admin-table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Message</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
              <Table.Row>
                <Table.Cell
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  <Loader />
                </Table.Cell>
              </Table.Row>
            ) : messages.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No contact messages found
                </Table.Cell>
              </Table.Row>
            ) : (
              messages.map((msg) => (
                <Table.Row key={msg._id}>
                  <Table.Cell>{msg._id}</Table.Cell>
                  <Table.Cell>{msg.name}</Table.Cell>
                  <Table.Cell>{msg.email}</Table.Cell>
                  <Table.Cell>{msg.message}</Table.Cell>
                  <Table.Cell>
                    <Select.Root
                      value={msg?.status}
                      onValueChange={(val) => handleStatusChange(msg._id, val)}
                      aria-label="Message status"
                    >
                      <Select.Trigger
                        variant="soft"
                        color={
                          msg.status === "RECEIVED"
                            ? "yellow"
                            : msg.status === "PENDING"
                            ? "cyan"
                            : "green"
                        }
                      />
                      <Select.Content color="yellow">
                        <Select.Item value="RECEIVED">Received</Select.Item>
                        <Select.Item value="PENDING">Pending</Select.Item>
                        <Select.Item value="REPLIED">Replied</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Table.Cell>
                  <Table.Cell>{formatDate(msg.createdAt)}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
};

export default Messages;
