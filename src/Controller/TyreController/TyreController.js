import asyncHandler from "express-async-handler";
import { Tyre } from "../../Model/Tyres/Tyres.js";
import uploadOnCloudinary from "../../Utils/Cloudinary.js";
import mongoose from "mongoose";



export const createTyre = asyncHandler(async (req, res) => {
  // Destructure fields from req.body
  const {
    slug,
    name,
    brand,
    category,
    size,
    price,
    oldPrice,
    dealer,
    description,
  } = req.body;

  // Convert stock and popular to boolean safely
  const stockValue = req.body.stock === "true" || req.body.stock === true;
  const popularValue = req.body.popular === "true" || req.body.popular === true;

  // Validate required fields
  if (!slug || !name || !brand || !category || !size || !price) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  // Check if tyre with same slug already exists
  const existing = await Tyre.findOne({ slug });
  if (existing) {
    return res
      .status(400)
      .json({ error: "Tyre with this slug already exists" });
  }

  // Handle uploaded files
  const productImages = req.files?.product_img?.map((file) => file.path) || [];
  if (productImages.length === 0) {
    return res.status(400).json({ error: "At least one image is required" });
  }

  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  // Upload images to Cloudinary
  const uploadResults = await Promise.all(
    productImages.map((filepath) => uploadOnCloudinary(filepath))
  );

  const imageUrls = uploadResults
    .filter((result) => result?.secure_url)
    .map((result) => result.secure_url);

  if (imageUrls.length === 0) {
    return res.status(500).json({ error: "Image upload failed" });
  }

  // Calculate oldPrice and discount
  const numericPrice = Number(price);
  const numericOldPrice = oldPrice ? Number(oldPrice) : numericPrice;
  const discount = oldPrice
    ? `${(((numericOldPrice - numericPrice) / numericOldPrice) * 100).toFixed(0)}%`
    : "0%";

  // Create Tyre document
  const tyre = new Tyre({
    slug,
    name,
    brand,
    category,
    size,
    price: numericPrice,
    oldPrice: numericOldPrice,
    discount,
    dealer,
    stock: stockValue,
    popular: popularValue,
    description,
    image: imageUrls,
    user: req.user?._id || null,
  });

  const createdTyre = await tyre.save();

  res.status(201).json({
    success: true,
    message: "Tyre created successfully",
    data: createdTyre,
  });
});



export const getTyres = asyncHandler(async (req, res) => {
  try {
    const tyre = await Tyre.find();
    res.json(tyre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }


//   const {
//     brand,
//     category,
//     minPrice,
//     maxPrice,
//     search,
//     sortBy = "createdAt",
//     order = "desc",
//     page = 1,
//     limit = 10
//   } = req.query;

//   const query = {};

//   if (brand) query.brand = brand;
//   if (category) query.category = category;
//   if (minPrice || maxPrice) {
//     query.price = {};
//     if (minPrice) query.price.$gte = Number(minPrice);
//     if (maxPrice) query.price.$lte = Number(maxPrice);
//   }

//   if (search) {
//     query.$text = { $search: search };
//   }

//   const skip = (Number(page) - 1) * Number(limit);

//   const tyres = await Tyre.find(query)
//     .populate("user", "name email") // Populate user info
//     .sort({ [sortBy]: order === "asc" ? 1 : -1 })
//     .skip(skip)
//     .limit(Number(limit));

//   const total = await Tyre.countDocuments(query);

//   res.status(200).json({
//     success: true,
//     total,
//     page: Number(page),
//     pages: Math.ceil(total / Number(limit)),
//     data: tyres
//   });


});




// ============================
// Get Tyre by ID or Slug
// ============================
export const getTyreByIdOrSlug = asyncHandler( async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const tyre =
      (await Tyre.findOne({ slug: idOrSlug }).populate("user", "name email")) ||
      (await Tyre.findById(idOrSlug).populate("user", "name email"));

    if (!tyre) {
      return res.status(404).json({ error: "Tyre not found" });
    }

    return res.status(200).json({
      success: true,
      data: tyre,
    });
  } catch (err) {
    console.error("Error fetching tyre:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ============================
// Update Tyre (with Cloudinary + Transaction)
// ============================

export const updateTyre = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const tyreId = req.params.id;
    if (!tyreId) {
      return res.status(400).json({ error: "Tyre ID is required" });
    }

    const updatedData = { ...req.body };
    let updatedImages = [];

    // =========================
    // Handle Image Upload (Cloudinary)
    // =========================
    if (req.files?.tyre_img) {
      const tyreImages = req.files.tyre_img.map((file) => file.path);

      const uploadResults = await Promise.all(
        tyreImages.map((filepath) => uploadOnCloudinary(filepath))
      );

      const imageUrls = uploadResults
        .filter((result) => result?.secure_url)
        .map((result) => result.secure_url);

      if (imageUrls.length === 0) {
        return res.status(500).json({ error: "Image upload failed" });
      }

      const existingTyre = await Tyre.findById(tyreId);
      if (!existingTyre) {
        return res.status(404).json({ error: "Tyre not found" });
      }

      const currentImageCount = existingTyre.image?.length || 0;
      updatedImages = [...(existingTyre.image || [])];
      if (currentImageCount >= 5) updatedImages.shift();

      updatedImages = [...updatedImages, ...imageUrls];
      updatedData.image = updatedImages;
    }

    // =========================
    // Discount Calculation Logic (Manual)
    // =========================
    const existingTyre = await Tyre.findById(tyreId);
    if (!existingTyre) {
      return res.status(404).json({ error: "Tyre not found" });
    }

    const price = updatedData.price ?? existingTyre.price;
    const oldPrice = updatedData.oldPrice ?? existingTyre.oldPrice;

    if (oldPrice && price && oldPrice > price) {
      const pct = ((oldPrice - price) / oldPrice) * 100;
      updatedData.discount = `${pct.toFixed(0)}%`;
    } else {
      updatedData.discount = null;
    }

    // =========================
    // Update Tyre Document
    // =========================
    const updatedTyre = await Tyre.findByIdAndUpdate(
      tyreId,
      { $set: updatedData },
      { new: true, runValidators: true, session }
    ).populate("user", "name email");

    if (!updatedTyre) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Updated Tyre not found" });
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Tyre updated successfully",
      updatedTyre,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("Failed to update tyre:", err);
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  } finally {
    session.endSession();
  }
});




// ============================
// Delete Tyre
// ============================
export const deleteTyre =asyncHandler( async (req, res) => {
  try {
    const tyre = await Tyre.findByIdAndDelete(req.params.id);
    if (!tyre) {
      return res.status(404).json({ error: "Tyre not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Tyre deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting tyre:", err);
    return res.status(500).json({ error: err.message });
  }
});
