import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import reportRoutes from "./routes/report.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import datasetRoutes from "./routes/dataset.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/dataset", datasetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/reports", reportRoutes);
app.get("/", (req, res) => res.json({ status: "API running" }));

const PORT = process.env.PORT || 4000;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DTD Website API",
      version: "1.0.0",
      description: "API documentation for DTD Website",
    },
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
  },
  apis: ["./routes/*.js"], // path to the route files with swagger comments
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("MongoDB connection error:", err));
