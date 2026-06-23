import mongoose from "mongoose";
import contactRoutes from "../routes/contact.routes.js";
import authRoutes from "../routes/auth.routes.js";
import complaintRoutes from "../routes/complaint.routes.js";
import reportRoutes from "../routes/report.routes.js";
import datasetRoutes from "../routes/dataset.routes.js";
import statsRoutes from "../routes/stats.routes.js";
import express from "express";
import cors from "cors";
import path from "path";

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
// Health checks
app.get("/", (req, res) => res.json({ status: "API running" }));
app.get("/api", (req, res) => res.json({ message: "API is working!" }));
app.get("/api-docs", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DTD API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          const ui = SwaggerUIBundle({
            spec: {
              openapi: "3.0.0",
              info: {
                title: "DTD API",
                version: "1.0.0",
                description: "API documentation for DTD Website"
              },
              paths: {
                "/api": {
                  get: {
                    summary: "Check API",
                    responses: {
                      200: {
                        description: "API working"
                      }
                    }
                  }
                }
              }
            },
            dom_id: "#swagger-ui"
          });
        </script>
      </body>
    </html>
  `);
});
// MongoDB connection (singleton for serverless)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export handler for Vercel
export default async function handler(req, res) {
  await connectToDB();
  return app(req, res);
}
