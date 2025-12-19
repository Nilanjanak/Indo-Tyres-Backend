import { Vehicle } from "../../Model/Vehicle/VehicleModel.js";

//
// ======================================================
// CREATE or UPDATE VEHICLE DATA
// ======================================================
export const createOrUpdateVehicle = async (req, res) => {
  try {
    const { car, twoWheeler, truck } = req.body;

    if (!car && !twoWheeler && !truck) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one category (car, twoWheeler, or truck)."
      });
    }

    let vehicleData = await Vehicle.findOne();
    if (!vehicleData) {
      vehicleData = new Vehicle({ car, twoWheeler, truck });
    } else {
      if (car) vehicleData.car = car;
      if (twoWheeler) vehicleData.twoWheeler = twoWheeler;
      if (truck) vehicleData.truck = truck;
    }

    const savedData = await vehicleData.save();

    res.status(201).json({
      success: true,
      message: "Vehicle data created/updated successfully.",
      data: savedData
    });
  } catch (error) {
    console.error("Error in createOrUpdateVehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

//
// ======================================================
// GET ALL VEHICLE DATA
// ======================================================
export const getAllVehicles = async (req, res) => {
  try {
    const vehicleData = await Vehicle.findOne();

    if (!vehicleData) {
      return res.status(404).json({
        success: false,
        message: "No vehicle data found."
      });
    }

    res.status(200).json({
      success: true,
      data: vehicleData
    });
  } catch (error) {
    console.error("Error in getAllVehicles:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

//
// ======================================================
// GET VEHICLES BY CATEGORY (car | twoWheeler | truck)
// ======================================================
export const getVehiclesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ["car", "twoWheeler", "truck"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use car, twoWheeler, or truck."
      });
    }

    const vehicleData = await Vehicle.findOne();
    if (!vehicleData) {
      return res.status(404).json({
        success: false,
        message: "No vehicle data found."
      });
    }

    res.status(200).json({
      success: true,
      data: vehicleData[category]
    });
  } catch (error) {
    console.error("Error in getVehiclesByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

//
// ======================================================
// ADD BRAND OR MODEL TO A CATEGORY
// ======================================================
export const addBrandOrModel = async (req, res) => {
  try {
    const { category } = req.params;
    const { name, models } = req.body;

    if (!["car", "twoWheeler", "truck"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use car, twoWheeler, or truck."
      });
    }

    if (!name || !models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Brand name and at least one model are required."
      });
    }

    const vehicleData = await Vehicle.findOne();
    if (!vehicleData) {
      return res.status(404).json({
        success: false,
        message: "Vehicle data not found. Please create it first."
      });
    }

    const categoryData = vehicleData[category];
    const existingBrand = categoryData.find(
      (brand) => brand.name.toLowerCase() === name.toLowerCase()
    );

    if (existingBrand) {
      // Add only new models
      const newModels = models.filter(
        (model) => !existingBrand.models.includes(model)
      );
      existingBrand.models.push(...newModels);
    } else {
      categoryData.push({ name, models });
    }

    await vehicleData.save();

    res.status(200).json({
      success: true,
      message: "Brand/model added successfully.",
      data: vehicleData[category]
    });
  } catch (error) {
    console.error("Error in addBrandOrModel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};

//
// ======================================================
// DELETE BRAND OR MODEL
// ======================================================
export const deleteBrandOrModel = async (req, res) => {
  try {
    const { category, brandName, modelName } = req.params;

    if (!["car", "twoWheeler", "truck"].includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Use car, twoWheeler, or truck."
      });
    }

    const vehicleData = await Vehicle.findOne();
    if (!vehicleData) {
      return res.status(404).json({
        success: false,
        message: "Vehicle data not found."
      });
    }

    const categoryData = vehicleData[category];
    const brand = categoryData.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase()
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found."
      });
    }

    if (modelName) {
      // Delete specific model
      brand.models = brand.models.filter(
        (m) => m.toLowerCase() !== modelName.toLowerCase()
      );
    } else {
      // Delete entire brand
      vehicleData[category] = categoryData.filter(
        (b) => b.name.toLowerCase() !== brandName.toLowerCase()
      );
    }

    await vehicleData.save();

    res.status(200).json({
      success: true,
      message: modelName
        ? `Model "${modelName}" removed from ${brandName}.`
        : `Brand "${brandName}" deleted successfully.`,
      data: vehicleData[category]
    });
  } catch (error) {
    console.error("Error in deleteBrandOrModel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message
    });
  }
};
