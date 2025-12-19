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

// ============================
// Register a new user
// ============================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Validate role (since it's enum in schema)

    const user = new User({
      username,
      email,
      password,
 
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        username:user.username
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Login user
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = user.generateAccessToken();

    user.lastLoginAt = new Date();
    await user.save();

    res.cookie("AccessToken", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        
      },
      token, // Optional: if you want token in response
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Logout user
// ============================
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("AccessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get current authenticated user
// ============================
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get all users (Admin only)
// ============================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Get user by ID
// ============================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Delete user
// ============================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// Update self (user profile)
// ============================
export const updateSelf = async (req, res) => {
  try {
    const allowedFields = ["username","email",];
    const updates = {};

    allowedFields.forEach((key) => {
      if (req.body[key]) updates[key] = req.body[key];
    });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check new password not same as old
    if (updates.password) {
      const isSame = await user.comparePassword(updates.password);
      if (isSame) {
        return res.status(400).json({
          error: "New password cannot be the same as the old password",
        });
      }
      const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const DashboardData = async (req, res) => {
  try {
    // Fetch all data in parallel
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

    // Send the combined response
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
    console.error("❌ Error fetching dashboard data:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};