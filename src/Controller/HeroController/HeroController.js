import { HeroSection } from "../../Model/Hero/Hero.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";

//
// ======================================================
// CREATE HERO SECTION
// ======================================================
export const createHeroSection = async (req, res) => {
  try {
    const { title, subtitle, features } = req.body;
    const imageFile = req.files?.image?.[0];
    const featureIcons = req.files?.featureIcons || [];

    if (!title || !subtitle || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Title, subtitle, and image file are required.",
      });
    }

    // Upload main hero image
    const heroUpload = await uploadOnCloudinary(imageFile.path);
    if (!heroUpload) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
      });
    }

    // Parse features JSON if provided
    let parsedFeatures = [];
    if (features) {
      parsedFeatures = JSON.parse(features);
    }

    // Upload feature icons and map to features
    const uploadedIcons = await Promise.all(
      featureIcons.map(async (file) => {
        const upload = await uploadOnCloudinary(file.path);
        return upload ? upload.secure_url : "";
      })
    );

    parsedFeatures = parsedFeatures.map((feature, i) => ({
      ...feature,
      icon: uploadedIcons[i] || feature.icon || "",
    }));

    const hero = new HeroSection({
      title,
      subtitle,
      image: heroUpload.secure_url,
      features: parsedFeatures,
    });

    const savedHero = await hero.save();

    res.status(201).json({
      success: true,
      message: "Hero section created successfully with features.",
      data: savedHero,
    });
  } catch (error) {
    console.error("Error creating hero section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// UPDATE HERO SECTION (Support Cloudinary Upload)
// ======================================================
export const updateHeroSection = async (req, res) => {
  try {
    const { title, subtitle, features } = req.body;
    const imageFile = req.files?.image?.[0];
    const featureIcons = req.files?.featureIcons || [];

    const hero = await HeroSection.findOne();
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    if (title) hero.title = title;
    if (subtitle) hero.subtitle = subtitle;

    // Upload new hero image if provided
    if (imageFile) {
      const uploadResponse = await uploadOnCloudinary(imageFile.path);
      if (uploadResponse) hero.image = uploadResponse.secure_url;
    }

    // If features JSON is provided, parse & update
    if (features) {
      let parsedFeatures = JSON.parse(features);

      // Upload new feature icons (if provided)
      const uploadedIcons = await Promise.all(
        featureIcons.map(async (file) => {
          const upload = await uploadOnCloudinary(file.path);
          return upload ? upload.secure_url : "";
        })
      );

      // Merge icons into parsed features
      parsedFeatures = parsedFeatures.map((feature, i) => ({
        ...feature,
        icon: uploadedIcons[i] || feature.icon || "",
      }));

      hero.features = parsedFeatures;
    }

    const updatedHero = await hero.save();

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully.",
      data: updatedHero,
    });
  } catch (error) {
    console.error("Error updating hero section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const getHeroSection = async(req, res)=>{
  try{
    const hero= await HeroSection.findOne();
     if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }
        res.status(200).json({
      success: true,
      message: "Hero section fetch successfully.",
      hero
    });
  }
  catch(err){
    console.error("Error updating hero section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
}
//
// ======================================================
// DELETE HERO SECTION
// ======================================================
export const deleteHeroSection = async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    await HeroSection.deleteOne({ _id: hero._id });

    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting hero section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// ADD FEATURE TO HERO SECTION (with Cloudinary upload)
// ======================================================
export const addFeature = async (req, res) => {
  try {
    const { title, description } = req.body;
    const iconFile = req.file;

    if (!title || !description || !iconFile) {
      return res.status(400).json({
        success: false,
        message: "Icon file, title, and description are required.",
      });
    }

    const hero = await HeroSection.findOne();
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    const uploadResponse = await uploadOnCloudinary(iconFile.path);
    if (!uploadResponse) {
      return res.status(500).json({
        success: false,
        message: "Icon upload failed.",
      });
    }

    hero.features.push({
      icon: uploadResponse.secure_url,
      title,
      description,
    });

    await hero.save();

    res.status(201).json({
      success: true,
      message: "Feature added successfully.",
      data: hero,
    });
  } catch (error) {
    console.error("Error adding feature:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// UPDATE FEATURE BY INDEX (with Cloudinary upload)
// ======================================================
export const updateFeature = async (req, res) => {
  try {
    const { index } = req.params;
    const { title, description } = req.body;
    const iconFile = req.file;

    const hero = await HeroSection.findOne();
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    if (index < 0 || index >= hero.features.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature index.",
      });
    }

    // Upload new icon if provided
    if (iconFile) {
      const uploadResponse = await uploadOnCloudinary(iconFile.path);
      if (uploadResponse) hero.features[index].icon = uploadResponse.secure_url;
    }

    // Update text fields
    if (title) hero.features[index].title = title;
    if (description) hero.features[index].description = description;

    await hero.save();

    res.status(200).json({
      success: true,
      message: "Feature updated successfully.",
      data: hero,
    });
  } catch (error) {
    console.error("Error updating feature:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE FEATURE BY INDEX
// ======================================================
export const deleteFeature = async (req, res) => {
  try {
    const { index } = req.params;

    const hero = await HeroSection.findOne();
    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found.",
      });
    }

    if (index < 0 || index >= hero.features.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid feature index.",
      });
    }

    hero.features.splice(index, 1);
    await hero.save();

    res.status(200).json({
      success: true,
      message: "Feature deleted successfully.",
      data: hero,
    });
  } catch (error) {
    console.error("Error deleting feature:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
