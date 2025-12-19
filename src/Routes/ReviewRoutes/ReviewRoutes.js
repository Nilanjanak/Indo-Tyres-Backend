import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByTyre,
  approveReview,
  deleteReview,
} from "../../Controller/ReviewsController/ReviewsController.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const ReviewRouter = express.Router();

// Public route: Create review
ReviewRouter.post("/", createReview);

// Get all reviews (Admin)
ReviewRouter.get("/",  getAllReviews);

// Get reviews for specific tyre
ReviewRouter.get("/tyre/:tyreId", getReviewsByTyre);

// Approve/disapprove review (Admin)
ReviewRouter.patch("/:id/approve", authenticate, approveReview);

// Delete review (Admin)
ReviewRouter.delete("/:id", authenticate, deleteReview);

export default ReviewRouter;
