import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("URI:", MONGO_URI);
console.log("SECRET:", JWT_SECRET);

import User from "./models/User.js";

async function run() {
  await mongoose.connect(MONGO_URI);
  const user = await User.findOne({ email: "admin@admin.com" });
  if (!user) {
    console.error("Admin user not found");
    process.exit(1);
  }
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  console.log("\nCopy-paste the following into browser console:\n");
  console.log(`localStorage.setItem("DTD_token", ${JSON.stringify(token)});`);
  console.log(`localStorage.setItem("DTD_user", JSON.stringify({
    id: "${user._id.toString()}",
    name: "${user.name}",
    email: "${user.email}",
    role: "${user.role}"
  }));`);
  console.log("\nThen reload the page.\n");
  process.exit(0);
}

run().catch(console.error);
