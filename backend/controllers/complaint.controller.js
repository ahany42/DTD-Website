import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const newComplaint = await Complaint.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Complaint Sent Successfully",
      complaint: newComplaint, // optional: lowercase to avoid confusion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all messages
export const getAllComplaints = async (req, res) => {
  try {
    const Complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(Complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
