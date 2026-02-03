import express from "express";
import {
  signup,
  login,
  forgotPassword,
  getAllUsers,
  getUserById,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/reset-password", resetPassword);

export default router;
