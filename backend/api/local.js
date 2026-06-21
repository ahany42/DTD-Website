import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "path";
import contactRoutes from "../routes/contact.routes.js";
import authRoutes from "../routes/auth.routes.js";
import complaintRoutes from "../routes/complaint.routes.js";
import reportRoutes from "../routes/report.routes.js";
import datasetRoutes from "../routes/dataset.routes.js";
import statsRoutes from "../routes/stats.routes.js";
import graphRoutes from "../routes/graph.routes.js";
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
    allowedHeaders: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/dataset", datasetRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/stats", statsRoutes);
app.use("/datasets", express.static(path.join(process.cwd(), "datasets")));
app.use("/api/graph", graphRoutes);
// Health checks
app.get("/", (req, res) => res.json({ status: "API running" }));
app.get("/api", (req, res) => res.json({ message: "API is working!" }));

// MongoDB connection singleton (for serverless)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/* ==========================
   SERVERLESS HANDLER (Vercel)
   ========================== */
export async function handler(req, res) {
  await connectToDB();
  return app(req, res);
}

/* ==========================
   LOCAL DEV
   ========================== */
if (process.env.NODE_ENV !== "production") {
  (async () => {
    await connectToDB();
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`🚀 Local server running on http://localhost:${PORT}`)
    );
  })();
}
