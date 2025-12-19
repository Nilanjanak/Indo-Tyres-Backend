import { Testimonial } from "../../Model/Testimonial/Testimonial.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

//
// ============================
// Create Testimonial
// ============================
export const createTestimonial = async (req, res) => {
  try {
    const { name,  comment, rating } = req.body;

    if (!name || !comment) {
      return res.status(400).json({
        success: false,
        error: "Name and comment are required",
      });
    }

    // ✅ Handle optional avatar upload
    let avatarUrl = "";
    console.log(req.file?.path)
    if (req.file?.path) {
        // console.log(req.file?.path)
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          error: "Avatar upload failed",
        });
      }
      avatarUrl = uploadResult.secure_url;
    } else if (req.body.avatar) {
      avatarUrl = req.body.avatar; // accept direct URL
    }

    const testimonial = new Testimonial({
      name,
      comment,
      rating,
      avatar: avatarUrl,
    });

    const savedTestimonial = await testimonial.save();

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: savedTestimonial,
    });
  } catch (error) {
    console.error("❌ Error creating testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Get All Testimonials
// ============================
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    if (!testimonials.length) {
      return res.status(404).json({
        success: false,
        message: "No testimonials found",
      });
    }

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error("❌ Error fetching testimonials:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Get Single Testimonial by ID
// ============================
export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("❌ Error fetching testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Update Testimonial
// ============================
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    // ✅ Handle new avatar upload
    if (req.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          error: "Avatar upload failed",
        });
      }
      updates.avatar = uploadResult.secure_url;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    console.error("❌ Error updating testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Delete Testimonial
// ============================
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting testimonial:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
