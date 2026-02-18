// localserver.js
import "dotenv/config"; // auto loads .env
import app from "./index.js"; // import your Vercel-compatible app
import mongoose from "mongoose";
// Use PORT from .env or default to 5000
const PORT = 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on ${process.env.BACKEND_URL}`)
    );
  })
  .catch((err) => console.log("MongoDB connection error:", err));
