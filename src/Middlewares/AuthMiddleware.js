import jwt from "jsonwebtoken";
import { User } from "../Model/User/User.js";

/**
 * Middleware: Authenticate user using
 * 1) HTTP-only cookie (AccessToken)
 * 2) Authorization: Bearer <token> (fallback)
 */
export const authenticate = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing");
      return res.status(500).json({ error: "Server configuration error" });
    }

    let token = null;

    // 1️⃣ Try cookie first (preferred)
    if (req.cookies?.AccessToken) {
      token = req.cookies.AccessToken;
    }

    // 2️⃣ Fallback to Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select(
      "_id email username"
    );

    if (!user) {
      return res.status(401).json({
        error: "Invalid token: user not found",
      });
    }

    // Attach safe user object
    req.user = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.name, err.message);

    // Clear cookie if token is invalid/expired
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      res.clearCookie("AccessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};
