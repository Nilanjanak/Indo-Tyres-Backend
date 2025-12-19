import { About } from "../../Model/About/About.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

/**
 * =====================================================
 * CREATE ABOUT PAGE (with Cloudinary upload)
 * =====================================================
 */
export const createAbout = async (req, res) => {
  try {
    const { hero, vision, coreValues, model, howItWorks, wideRange } = JSON.parse(req.body.data || "{}");

    // Validate essential sections
    if (!hero || !vision || !coreValues || !model || !howItWorks || !wideRange) {
      return res.status(400).json({
        success: false,
        message: "All sections (hero, vision, coreValues, model, howItWorks, wideRange) are required.",
      });
    }

    // Only one About page
    const existing = await About.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "About page already exists. Use update instead.",
      });
    }

    // Upload hero image & video
    if (req.files?.heroImage) {
      const uploaded = await uploadOnCloudinary(req.files.heroImage[0].path);
      hero.image = uploaded.secure_url;
    }

    if (req.files?.heroVideo) {
      const uploaded = await uploadOnCloudinary(req.files.heroVideo[0].path);
      hero.video = uploaded.secure_url;
    }

    // Upload model image
    if (req.files?.modelImage) {
      const uploaded = await uploadOnCloudinary(req.files.modelImage[0].path);
      model.image = uploaded.secure_url;
    }

    // Upload howItWorks icons
    if (req.files?.howItWorksIcons) {
      for (let i = 0; i < req.files.howItWorksIcons.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files.howItWorksIcons[i].path);
        if (howItWorks[i]) howItWorks[i].icon = uploaded.secure_url;
      }
    }

    // Upload core values icons
    if (req.files?.coreValueIcons) {
      for (let i = 0; i < req.files.coreValueIcons.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files.coreValueIcons[i].path);
        if (coreValues[i]) coreValues[i].icon = uploaded.secure_url;
      }
    }

    // Upload wideRange images (array)
    if (req.files?.wideRangeImages) {
      wideRange.images = [];
      for (const file of req.files.wideRangeImages) {
        const uploaded = await uploadOnCloudinary(file.path);
        wideRange.images.push(uploaded.secure_url);
      }
    }

    // Upload wideRange video
    if (req.files?.wideRangeVideo) {
      const uploaded = await uploadOnCloudinary(req.files.wideRangeVideo[0].path);
      wideRange.video = uploaded.secure_url;
    }

    const about = new About({
      hero,
      vision,
      coreValues,
      model,
      howItWorks,
      wideRange,
    });

    const savedAbout = await about.save();

    res.status(201).json({
      success: true,
      message: "About page created successfully.",
      data: savedAbout,
    });
  } catch (error) {
    console.error("❌ Error creating About page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * GET ABOUT PAGE
 * =====================================================
 */
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("❌ Error fetching About page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * UPDATE ABOUT PAGE (Cloudinary support)
 * =====================================================
 */
export const updateAbout = async (req, res) => {
  try {
    const updates = JSON.parse(req.body.data || "{}");
    const existing = await About.findOne();

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "About page not found. Please create it first.",
      });
    }

    // Handle file uploads for updates
    const uploadField = async (fileField, targetPath) => {
      if (req.files?.[fileField]) {
        const uploaded = await uploadOnCloudinary(req.files[fileField][0].path);
        const [section, key] = targetPath.split(".");
        updates[section] = updates[section] || {};
        updates[section][key] = uploaded.secure_url;
      }
    };

    await uploadField("heroImage", "hero.image");
    await uploadField("heroVideo", "hero.video");
    await uploadField("modelImage", "model.image");
    await uploadField("wideRangeVideo", "wideRange.video");

    // Update wideRange images (array)
    if (req.files?.wideRangeImages) {
      updates.wideRange = updates.wideRange || {};
      updates.wideRange.images = [];
      for (const file of req.files.wideRangeImages) {
        const uploaded = await uploadOnCloudinary(file.path);
        updates.wideRange.images.push(uploaded.secure_url);
      }
    }

    // Update icons (core values + how it works)
    if (req.files?.coreValueIcons) {
      for (let i = 0; i < req.files.coreValueIcons.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files.coreValueIcons[i].path);
        if (updates.coreValues && updates.coreValues[i]) {
          updates.coreValues[i].icon = uploaded.secure_url;
        }
      }
    }

    if (req.files?.howItWorksIcons) {
      for (let i = 0; i < req.files.howItWorksIcons.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files.howItWorksIcons[i].path);
        if (updates.howItWorks && updates.howItWorks[i]) {
          updates.howItWorks[i].icon = uploaded.secure_url;
        }
      }
    }

    // Merge and save
    Object.assign(existing, updates);
    const updated = await existing.save();

    res.status(200).json({
      success: true,
      message: "About page updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error updating About page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * =====================================================
 * DELETE ABOUT PAGE
 * =====================================================
 */
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found.",
      });
    }

    await About.deleteOne({ _id: about._id });

    res.status(200).json({
      success: true,
      message: "About page deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting About page:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
