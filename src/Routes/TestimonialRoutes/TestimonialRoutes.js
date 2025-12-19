import express from "express";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";
import { upload } from "../../Middlewares/Multer.js";
import {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} from "../../Controller/TestimonialController/TestimonialController.js";

const TestimonialRouter = express.Router();

// Multer middleware — for a single optional avatar upload
const uploadMiddleware = upload.single("avatar");

// ✅ Protect all testimonial routes (only authenticated users can manage)
// TestimonialRouter.use(authenticate);

// ✅ Create new testimonial & Get all testimonials
TestimonialRouter.route("/")
  .post(authenticate, uploadMiddleware, createTestimonial)
  .get(getAllTestimonials);

// ✅ Get, Update, Delete testimonial by ID
TestimonialRouter.route("/:id")
  .get(getTestimonialById)
  .patch(authenticate, uploadMiddleware, updateTestimonial)
  .delete(authenticate, deleteTestimonial);

export default TestimonialRouter;
