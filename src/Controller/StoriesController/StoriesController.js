import { Story } from "../../Model/Stories/Stories.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

//
// ============================
// Create Story
// ============================
export const createStory = async (req, res) => {
  try {
    const { title, summary } = req.body;

    // Validate required fields
    if (!title || !summary) {
      return res.status(400).json({
        success: false,
        error: "Title and summary are required",
      });
    }

    // Prevent duplicate titles
    const existingStory = await Story.findOne({ title });
    if (existingStory) {
      return res.status(400).json({
        success: false,
        error: "A story with this title already exists",
      });
    }

    // Handle image upload (from file or direct URL)
    let imageUrl = null;

    // ✅ If using multer.single("story_img")
    if (req.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          error: "Image upload failed",
        });
      }
      imageUrl = uploadResult.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image; // accept direct URL
    } else {
      return res.status(400).json({
        success: false,
        error: "Image is required",
      });
    }

    const newStory = new Story({
      title,
      summary,
      image: imageUrl,
    });

    const savedStory = await newStory.save();

    return res.status(201).json({
      success: true,
      message: "Story created successfully",
      data: savedStory,
    });
  } catch (error) {
    console.error("❌ Error creating story:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Get All Stories
// ============================
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });

    if (!stories.length) {
      return res.status(404).json({
        success: false,
        message: "No stories found",
      });
    }

    return res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Get Story by ID
// ============================
export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("❌ Error fetching story:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Update Story
// ============================
export const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    // Handle new image upload
    if (req.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          error: "Image upload failed",
        });
      }
      updates.image = uploadResult.secure_url;
    }

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    console.error("❌ Error updating story:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// ============================
// Delete Story
// ============================
export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Story.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Story not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting story:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
