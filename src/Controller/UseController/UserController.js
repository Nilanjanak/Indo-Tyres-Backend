import bcrypt from "bcrypt";
import { User } from "../../Model/User/User.js";
import { About } from "../../Model/About/About.js";
import { Enquiry } from "../../Model/Enquiry/Enquiry.js";
import { Faq } from "../../Model/Faq/Faq.js";
import { Footer } from "../../Model/Footer/Footer.js";
import { Growth } from "../../Model/Growth/Growth.js";
import { HeroSection } from "../../Model/Hero/Hero.js";
import { Journey } from "../../Model/Journey/Journey.js";
import { Vehicle } from "../../Model/MockVehicles/MockVehicles.js";
import { Newsletter } from "../../Model/NewsLetter/NewsLetter.js";
import { Review } from "../../Model/Reviews/Reviews.js";
import { ShopByVehicle } from "../../Model/Shopbyvehicle/ShopbyVehicle.js";
import { Story } from "../../Model/Stories/Stories.js";
import { Testimonial } from "../../Model/Testimonial/Testimonial.js";
import { TrustedStory } from "../../Model/TrustedStory/TrustedStory.js";
import { Tyre } from "../../Model/Tyres/Tyres.js";

const isProd = process.env.NODE_ENV === "production";

/* ======================================================
   REGISTER USER
====================================================== */
export const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    email = email.toLowerCase().trim();

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   LOGIN USER (PRODUCTION SAFE)
====================================================== */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = user.generateAccessToken();

    user.lastLoginAt = new Date();
    await user.save();

    // 🔥 Correct cross-domain cookie
    res.cookie("AccessToken", token, {
      httpOnly: true,
      secure: isProd,                  // true in production
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,      // 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   LOGOUT USER (MATCHES LOGIN COOKIE)
====================================================== */
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("AccessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   CURRENT AUTHENTICATED USER
====================================================== */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   UPDATE SELF
====================================================== */
export const updateSelf = async (req, res) => {
  try {
    const allowedFields = ["username", "email", "password"];
    const updates = {};

    allowedFields.forEach((key) => {
      if (req.body[key]) updates[key] = req.body[key];
    });

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    if (updates.password) {
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================
   DASHBOARD DATA
====================================================== */
export const DashboardData = async (req, res) => {
  try {
    const [
      about,
      enquiry,
      faq,
      footer,
      growth,
      heroSection,
      journey,
      vehicle,
      newsletter,
      review,
      shopByVehicle,
      story,
      testimonial,
      trustedStory,
      tyre,
    ] = await Promise.all([
      About.find(),
      Enquiry.find(),
      Faq.find(),
      Footer.find(),
      Growth.find(),
      HeroSection.find(),
      Journey.find(),
      Vehicle.find(),
      Newsletter.find(),
      Review.find(),
      ShopByVehicle.find(),
      Story.find(),
      Testimonial.find(),
      TrustedStory.find(),
      Tyre.find(),
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        about,
        enquiry,
        faq,
        footer,
        growth,
        heroSection,
        journey,
        vehicle,
        newsletter,
        review,
        shopByVehicle,
        story,
        testimonial,
        trustedStory,
        tyre,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};
