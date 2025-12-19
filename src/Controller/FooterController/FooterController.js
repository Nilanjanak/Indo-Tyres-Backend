import { Footer } from "../../Model/Footer/Footer.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

// ==========================================
// @desc    Create a new Footer entry
// @route   POST /api/footer
// @access  Private/Admin
// ==========================================
export const createFooter = async (req, res) => {
  try {
    const { company, quickLinks, supportLinks, contactInfo } = req.body;

    // Parse JSON fields if sent as strings in form-data
    const parsedCompany = typeof company === "string" ? JSON.parse(company) : company;
    const parsedQuickLinks =
      typeof quickLinks === "string" ? JSON.parse(quickLinks) : quickLinks;
    const parsedSupportLinks =
      typeof supportLinks === "string" ? JSON.parse(supportLinks) : supportLinks;
    const parsedContactInfo =
      typeof contactInfo === "string" ? JSON.parse(contactInfo) : contactInfo;

    let parsedSocialLinks = [];
    if (req.body.socialLinks) {
      parsedSocialLinks =
        typeof req.body.socialLinks === "string"
          ? JSON.parse(req.body.socialLinks)
          : req.body.socialLinks;
    }

    if (!parsedCompany || !parsedQuickLinks || !parsedSupportLinks || !parsedContactInfo) {
      return res.status(400).json({
        success: false,
        error: "All required footer sections must be provided.",
      });
    }

    // Only allow one footer
    const existing = await Footer.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Footer already exists. Please update instead.",
      });
    }

    // ✅ Handle social icons upload (if files provided)
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files[i].path);
        if (parsedSocialLinks[i]) {
          parsedSocialLinks[i].icon = uploaded?.secure_url;
        }
      }
    }

    const footer = new Footer({
      company: parsedCompany,
      quickLinks: parsedQuickLinks,
      supportLinks: parsedSupportLinks,
      contactInfo: parsedContactInfo,
      socialLinks: parsedSocialLinks,
    });

    const savedFooter = await footer.save();

    return res.status(201).json({
      success: true,
      message: "Footer created successfully",
      data: savedFooter,
    });
  } catch (error) {
    console.error("❌ Error creating footer:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Get all footers
// @route   GET /api/footer
// @access  Public
// ==========================================
export const getAllFooters = async (req, res) => {
  try {
    const footers = await Footer.find();
    res.status(200).json({
      success: true,
      count: footers.length,
      data: footers,
    });
  } catch (error) {
    console.error("❌ Error fetching footers:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Get footer by ID
// @route   GET /api/footer/:id
// @access  Public
// ==========================================
export const getFooterById = async (req, res) => {
  try {
    const footer = await Footer.findById(req.params.id);
    if (!footer) {
      return res.status(404).json({
        success: false,
        error: "Footer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("❌ Error fetching footer by ID:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Update footer by ID
// @route   PATCH /api/footer/:id
// @access  Private/Admin
// ==========================================
export const updateFooter = async (req, res) => {
  try {
    const footerId = req.params.id;
    const { company, quickLinks, supportLinks, contactInfo, socialLinks } = req.body;

    // Parse JSON fields
    const parsedCompany = typeof company === "string" ? JSON.parse(company) : company;
    const parsedQuickLinks = typeof quickLinks === "string" ? JSON.parse(quickLinks) : quickLinks;
    const parsedSupportLinks = typeof supportLinks === "string" ? JSON.parse(supportLinks) : supportLinks;
    const parsedContactInfo = typeof contactInfo === "string" ? JSON.parse(contactInfo) : contactInfo;
    let parsedSocialLinks = typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks || [];

    // Upload new icons if any files provided
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const uploaded = await uploadOnCloudinary(req.files[i].path);
        if (parsedSocialLinks[i]) {
          parsedSocialLinks[i].icon = uploaded?.secure_url;
        }
      }
    }

    // Ensure every social link has an icon (URL or placeholder)
    parsedSocialLinks = parsedSocialLinks.map((link) => ({
      name: link.name || "",
      url: link.url || "",
      icon: link.icon || "", // keep existing or empty string
    }));

    const updatedFooter = await Footer.findByIdAndUpdate(
      footerId,
      {
        company: parsedCompany,
        quickLinks: parsedQuickLinks,
        supportLinks: parsedSupportLinks,
        contactInfo: parsedContactInfo,
        socialLinks: parsedSocialLinks,
      },
      { new: true, runValidators: true }
    );

    if (!updatedFooter) {
      return res.status(404).json({ success: false, error: "Footer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Footer updated successfully",
      data: updatedFooter,
    });
  } catch (error) {
    console.error("❌ Error updating footer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// @desc    Delete footer by ID
// @route   DELETE /api/footer/:id
// @access  Private/Admin
// ==========================================
export const deleteFooter = async (req, res) => {
  try {
    const deletedFooter = await Footer.findByIdAndDelete(req.params.id);
    if (!deletedFooter) {
      return res.status(404).json({
        success: false,
        error: "Footer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Footer deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting footer:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
