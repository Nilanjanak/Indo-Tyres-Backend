import mongoose from "mongoose";
import { Review } from "../../Model/Reviews/Reviews.js";
import { Tyre } from "../../Model/Tyres/Tyres.js";

//
// =======================================
// Create Review
// =======================================
export const createReview = async (req, res) => {
    const session = await mongoose.startSession();
  try {
    const {id}= req.params;
    const { name, location, rating, comment, tyre } = req.body;

    // Validate required fields
    if (!name || !rating || !comment || !tyre) {
      return res.status(400).json({
        success: false,
        error: "Name, rating, comment, and tyre are required",
      });
    }

    // Check if tyre exists
    const existingTyre = await Tyre.findById(tyre);
    if (!existingTyre) {
      return res.status(404).json({
        success: false,
        error: "Tyre not found",
      });
    }
    const TYRE= await Tyre.findById(tyre);
    // console.log(user);
    // Create review
    const newReview = new Review({
      name,
      location,
      rating,
      comment,
      tyre,
      approved: true, // can set to false for moderation
    });
     session.startTransaction();
    await newReview.save({session});
   TYRE.reviews.push(newReview._id);
   await TYRE.save({session});
    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Get All Reviews (Admin)
// =======================================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("tyre", "name brand category price")
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Get Reviews by Tyre ID
// =======================================
export const getReviewsByTyre = async (req, res) => {
  try {
    const { tyreId } = req.params;

    if (!tyreId) {
      return res.status(400).json({
        success: false,
        error: "Tyre ID is required",
      });
    }

    const reviews = await Review.find({ tyre: tyreId, approved: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("❌ Error fetching tyre reviews:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Approve or Reject a Review (Admin)
// =======================================
export const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Approved field must be true or false",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    review.approved = approved;
    await review.save();

    return res.status(200).json({
      success: true,
      message: approved
        ? "Review approved successfully"
        : "Review disapproved successfully",
      data: review,
    });
  } catch (error) {
    console.error("❌ Error approving review:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Delete Review (Admin)
// =======================================
export const deleteReview = async (req, res) => {
    const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    session.startTransaction();
    const review = await Review.findByIdAndDelete(id).populate("tyre");
    if(review.tyre){
        review.tyre.reviews.pull(review._id);
        await review.tyre.save({session})
    }
    await session.commitTransaction();
    session.endSession();
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
