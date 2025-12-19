import { TrustedStory } from "../../Model/TrustedStory/TrustedStory.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

/**
 * @desc Create a new Trusted Story
 * @route POST /api/trusted-stories
 */


export const createTrustedStory = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    // Check for duplicate title
    const existingStory = await TrustedStory.findOne({ title });
    if (existingStory) {
      return res.status(400).json({
        success: false,
        message: "A trusted story with this title already exists.",
      });
    }

    // Handle image upload
    let imageUrl;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      imageUrl = uploadResult.secure_url; // ✅ string
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const newStory = new TrustedStory({
      title,
      description,
      image: imageUrl, // must be string, not object
    });

    const savedStory = await newStory.save();

    return res.status(201).json({
      success: true,
      message: "Trusted story created successfully.",
      data: savedStory,
    });
  } catch (error) {
    console.error("Error creating trusted story:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


/**
 * @desc Get all Trusted Stories
 * @route GET /api/trusted-stories
 */
export const getAllTrustedStories = async (req, res) => {
  try {
    const stories = await TrustedStory.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching trusted stories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * @desc Get a single Trusted Story by ID
 * @route GET /api/trusted-stories/:id
 */
export const getTrustedStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await TrustedStory.findById(id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Trusted story not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error fetching trusted story:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * @desc Update a Trusted Story
 * @route PATCH /api/trusted-stories/:id
 */
export const updateTrustedStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const story = await TrustedStory.findById(id);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Trusted story not found.",
      });
    }

    // If new image uploaded
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
      updates.image = uploadResult.secure_url;
    }

    const updatedStory = await TrustedStory.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Trusted story updated successfully.",
      data: updatedStory,
    });
  } catch (error) {
    console.error("Error updating trusted story:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a Trusted Story
 * @route DELETE /api/trusted-stories/:id
 */
export const deleteTrustedStory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStory = await TrustedStory.findByIdAndDelete(id);
    if (!deletedStory) {
      return res.status(404).json({
        success: false,
        message: "Trusted story not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trusted story deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting trusted story:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
