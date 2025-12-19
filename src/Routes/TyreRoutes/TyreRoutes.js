import express from "express";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";
import { upload } from "../../Middlewares/Multer.js";
import {
  createTyre,
  getTyres,
  getTyreByIdOrSlug,
  updateTyre,
  deleteTyre,
} from "../../Controller/TyreController/TyreController.js";

const TyreRouter = express.Router();

// Multer middleware for multiple image uploads — field name: product_img
const uploadMiddleware = upload.fields([{ name: "product_img", maxCount: 5 }]);

// ✅ Protect all routes (requires login)
// TyreRouter.use(authenticate);

// ✅ Create & Get All Tyres
TyreRouter.route("/")
  .post(authenticate, uploadMiddleware, createTyre)
  .get(getTyres);

// ✅ Get Tyre by ID or Slug
TyreRouter.route("/:idOrSlug").get(getTyreByIdOrSlug);

// ✅ Update & Delete Tyre by ID
TyreRouter.route("/:id")
  .patch(authenticate,uploadMiddleware, updateTyre)
  .delete(authenticate,deleteTyre);

export default TyreRouter;
