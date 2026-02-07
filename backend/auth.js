import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";
import mongoose from "mongoose";
export function generateToken(user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined!");
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
export const getUserRoleById = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

    const user = await User.findById(userId).select("role name email");

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: {
        role: user.role,
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    };
  } catch (error) {
    console.error("Error fetching user role:", error);
    return {
      success: false,
      message: "Failed to fetch user role",
      error: error.message,
    };
  }
};
export const verifyRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user role
      const userRoleRes = await getUserRoleById(decoded.id);
      if (!userRoleRes.success) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRole = userRoleRes.data.role;
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role" });
      }

      req.user = userRoleRes.data; // attach user info to request
      next();
    } catch (error) {
      console.error("Role verification error:", error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
