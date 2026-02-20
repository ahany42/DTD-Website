import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateToken } from "../auth.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONT_END}/reset-password/${token}`;
    const currentYear = new Date().getFullYear();

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Styled HTML email for DTD Data
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f5f5f5; color: #333;">
          <table align="center" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="20" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td align="center">
                      <img src="https://www.wiz.ai/content/uploads/2025/09/Blog-images-scaled.jpg" alt="DTD Data Logo" width="320">
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 15px; font-size: 22px; font-weight: bold;">
                      Reset Your Password
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; font-size: 16px; line-height: 1.5; text-align:center;">
                      You requested to reset your password for your DTD Data Deployment account.<br><br>
                      Click the button below to reset your password:
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <a href="${resetUrl}" style="display:inline-block; padding: 12px 25px; background-color: #00a3ff; color: #ffffff; font-weight:bold; border-radius: 5px; text-decoration:none;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; font-size: 14px; color: #555; text-align:center;">
                      If you did not request this, please ignore this email.
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="background-color: #00a3ff; padding: 20px; color: #ffffff; border-radius: 0 0 8px 8px;">
                      <p style="margin:0; font-size:12px;">&copy; ${currentYear} DTD Data to Deployment</p>
                      <p style="margin:5px 0 0;">
                        <a href="https://www.linkedin.com/" style="margin:0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width="25" alt="LinkedIn" /></a>
                        <a href="https://www.facebook.com/" style="margin:0 5px;"><img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" width="25" alt="Facebook" /></a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Your DTD Data To Deployment Password",
      html: htmlContent,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    verifyToken(req);

    // Read page & limit from query, default to page 1 and 10 items per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total number of users
    const total = await User.countDocuments();

    // Fetch users with pagination, exclude passwords
    const users = await User.find().select("-password").skip(skip).limit(limit);

    res.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total: total,
      data: users,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
export const getUserById = async (req, res) => {
  try {
    verifyToken(req);

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
