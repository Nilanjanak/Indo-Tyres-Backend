import express from "express";
import multer from "multer";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../Controller/ShopbyVehiclesController/ShopbyVehiclesController.js";

const ShopbyVehiclerouter = express.Router();
const upload = multer({ dest: "uploads/" }); // your multer setup (can be customized)

// CRUD routes
ShopbyVehiclerouter.get("/", getAllVehicles);
ShopbyVehiclerouter.get("/:id", getVehicleById);
ShopbyVehiclerouter.post("/", upload.single("image"), createVehicle);
ShopbyVehiclerouter.put("/:id", upload.single("image"), updateVehicle);
ShopbyVehiclerouter.delete("/:id", deleteVehicle);

export default ShopbyVehiclerouter;
