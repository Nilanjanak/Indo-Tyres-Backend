import { ShopByVehicle } from "../../Model/Shopbyvehicle/ShopbyVehicle.js";
import uploadOnCloudinary  from "../../Utils/Cloudinary.js"; // your helper function

/**
 * @desc Get all vehicle categories
 * @route GET /api/shop-by-vehicle
 */
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await ShopByVehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles", error: error.message });
  }
};

/**
 * @desc Get single vehicle by ID
 * @route GET /api/shop-by-vehicle/:id
 */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await ShopByVehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicle", error: error.message });
  }
};

/**
 * @desc Create a new vehicle (with image upload)
 * @route POST /api/shop-by-vehicle
 */
export const createVehicle = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path, "vehicles");
      imageUrl = uploadResult.secure_url;
    }

    const newVehicle = new ShopByVehicle({
      ...req.body,
      image: imageUrl || req.body.image, // fallback if Cloudinary not used
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(400).json({ message: "Failed to create vehicle", error: error.message });
  }
};

/**
 * @desc Update a vehicle (optionally upload new image)
 * @route PUT /api/shop-by-vehicle/:id
 */
export const updateVehicle = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path, "vehicles");
      updateData.image = uploadResult.secure_url;
    }

    const updatedVehicle = await ShopByVehicle.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: "Failed to update vehicle", error: error.message });
  }
};

/**
 * @desc Delete a vehicle
 * @route DELETE /api/shop-by-vehicle/:id
 */
export const deleteVehicle = async (req, res) => {
  try {
    const deletedVehicle = await ShopByVehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vehicle", error: error.message });
  }
};
