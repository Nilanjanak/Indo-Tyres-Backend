// routes/HeroSectionRouter.js
import express from "express";
import {
  createHeroSection,
  getHeroSection,
  updateHeroSection,
  deleteHeroSection,
  addFeature,
  updateFeature,
  deleteFeature,
} from "../../Controller/HeroController/HeroController.js";
import { upload } from "../../Middlewares/Multer.js"; // your multer setup

const HeroSectionRouter = express.Router();

// Main hero section CRUD
HeroSectionRouter.route("/")
  .post(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "featureIcons", maxCount: 10 },
    ]),
    createHeroSection
  )
  .get(getHeroSection)

  HeroSectionRouter.route("/:id").patch(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "featureIcons", maxCount: 10 },
    ]),
    updateHeroSection
  )
  .delete(deleteHeroSection);

HeroSectionRouter.post("/feature", upload.single("icon"), addFeature);
HeroSectionRouter.put("/feature/:index", upload.single("icon"), updateFeature);
HeroSectionRouter.delete("/feature/:index", deleteFeature);

export default HeroSectionRouter;
