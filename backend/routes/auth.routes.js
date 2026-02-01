import express from "express";
import {
  signup,
  login,
  forgotPassword,
  getAllUsers,
  getUserById,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
export default router;
