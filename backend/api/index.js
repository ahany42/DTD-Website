import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import contactRoutes from "../routes/contact.routes.js";
import authRoutes from "../routes/auth.routes.js";
import complaintRoutes from "../routes/complaint.routes.js";
import reportRoutes from "../routes/report.routes.js";
import datasetRoutes from "../routes/dataset.routes.js";
import statsRoutes from "../routes/stats.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://dtd-one.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Routes
app.use("/api/dataset", datasetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stats", statsRoutes);

// Health checks
app.get("/", (req, res) => res.json({ status: "API running" }));
app.get("/api", (req, res) => res.json({ message: "API is working!" }));

console.log("App initialized...");
export default app;
