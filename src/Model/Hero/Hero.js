import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument schema for feature items
const FeatureSchema = new Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  { _id: false }
);

// Main Hero Section schema
const HeroSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    features: {
      type: [FeatureSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const HeroSection = mongoose.model("HeroSection", HeroSectionSchema);
