import express from "express";
import {
  createAbout,
  getAbout,
  updateAbout,
  deleteAbout,
} from "../../Controller/AboutController/AboutController.js";

import { upload } from "../../Middlewares/Multer.js";

const AboutRouter = express.Router();

// expected file fields
const aboutUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "heroVideo", maxCount: 1 },
  { name: "modelImage", maxCount: 1 },
  { name: "coreValueIcons", maxCount: 10 },
  { name: "howItWorksIcons", maxCount: 10 },
  { name: "wideRangeImages", maxCount: 10 },
  { name: "wideRangeVideo", maxCount: 1 },
]);

AboutRouter.route("/")
  .post(aboutUpload, createAbout)
  .get(getAbout)
  .put(aboutUpload, updateAbout)
  .delete(deleteAbout);

export default AboutRouter;
