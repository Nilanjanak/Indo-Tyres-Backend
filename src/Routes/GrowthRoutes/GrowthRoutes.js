import express from "express";
import {
  createGrowth,
  getGrowth,
  getGrowthByYear,
  updateGrowth,
  deleteGrowth,
  deleteAllGrowth
} from "../../Controller/GrowthController/GrowthController.js";

const GrowthRouter = express.Router();

GrowthRouter.post("/", createGrowth);           // Create new record
GrowthRouter.get("/", getGrowth);               // Get all
GrowthRouter.get("/:year", getGrowthByYear);    // Get one by year
GrowthRouter.put("/:year", updateGrowth);       // Update one by year
GrowthRouter.delete("/:year", deleteGrowth);    // Delete one by year
GrowthRouter.delete("/", deleteAllGrowth);      // Delete all (optional)

export default GrowthRouter;
