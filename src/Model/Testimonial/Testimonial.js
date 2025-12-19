import mongoose from "mongoose";
const { Schema } = mongoose;

const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    // Optional fields (useful if you add avatars or ratings later)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    avatar: {
      type: String, // Cloudinary or static path
      trim: true,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
