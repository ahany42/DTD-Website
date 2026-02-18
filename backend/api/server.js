// localserver.js
import "dotenv/config"; // auto loads .env
import app from "./index.js"; // import your Vercel-compatible app

// Use PORT from .env or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running locally at http://localhost:${PORT}`);
});
