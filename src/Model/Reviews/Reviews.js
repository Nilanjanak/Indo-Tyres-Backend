import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    tyre: {
      type: Schema.Types.ObjectId,
      ref: "Tyre",
    },
    

    approved: {
      type: Boolean,
      default: true // set to false if you want admin moderation
    }
  },
  {
    timestamps: true
  }
);

// optional: index for faster queries by tyre or rating
ReviewSchema.index({ tyre: 1, rating: -1 });

export const Review = mongoose.model("Review", ReviewSchema);
