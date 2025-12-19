import express from "express";
import {
  createOrUpdateVehicle,
  getAllVehicles,
  getVehiclesByCategory,
  addBrandOrModel,
  deleteBrandOrModel
} from "../../Controller/MockVehicleController/MockVehicleController.js";

const VehicleRouter = express.Router();

VehicleRouter.route("/")
  .post(createOrUpdateVehicle)
  .get(getAllVehicles);

VehicleRouter.get("/:category", getVehiclesByCategory);
VehicleRouter.post("/:category/add", addBrandOrModel);
VehicleRouter.delete("/:category/:brandName/:modelName?", deleteBrandOrModel);

export default VehicleRouter;