import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import reportRoutes from "./routes/report.routes.js";
import datasetRoutes from "./routes/dataset.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/datasets", express.static("uploads"));

app.use("/api/dataset", datasetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => res.json({ status: "API running" }));
app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});
// Swagger setup
const PORT = process.env.PORT || 4000;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DTD Website API",
      version: "1.0.0",
      description: "API documentation for DTD Website",
    },
    servers: [{ url: process.env.BACKEND_URL || `http://localhost:${PORT}` }],
  },
  apis: ["./routes/*.js"],
};
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions))
);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));
console.log("🚀 Server Running ..... ");
export default app; // keep ESM export
