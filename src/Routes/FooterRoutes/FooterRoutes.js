import express from "express";
import { upload } from "../../Middlewares/Multer.js";
import {
  createFooter,
  getAllFooters,
  // getFooterById,
  updateFooter,
  deleteFooter,
} from "../../Controller/FooterController/FooterController.js";

const router = express.Router();

// Use multer to handle multiple icon uploads (e.g. socialLinks)
router.post("/", upload.array("icons", 5), createFooter);
router.get("/", getAllFooters);
// router.get("/:id", getFooterById);
router.patch("/:id", upload.array("icons", 5), updateFooter);
router.delete("/:id", deleteFooter);

export default router;
