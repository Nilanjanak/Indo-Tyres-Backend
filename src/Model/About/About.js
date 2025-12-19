import mongoose from "mongoose";
const { Schema } = mongoose;

// Reusable sub-schemas
const CoreValueSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const HowItWorksSchema = new Schema(
  {
    icon: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const AboutSchema = new Schema(
  {
    hero: {
      title: { type: String, required: true, trim: true, maxlength: 150 },
      description: { type: String, required: true, trim: true, maxlength: 500 },
      image: {
        type: String,
        required: true,
        trim: true,
        match: /^\/|https?:\/\//, // supports relative or absolute URLs
      },
      video: {
        type: String,
        trim: true,
        match: /^\/|https?:\/\//,
      },
    },

    vision: {
      title: { type: String, required: true, trim: true, maxlength: 100 },
      description: { type: String, required: true, trim: true, maxlength: 500 },
    },

    coreValues: {
      type: [CoreValueSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one core value is required.",
      },
    },

    model: {
      title: { type: String, required: true, trim: true, maxlength: 100 },
      description: { type: String, required: true, trim: true, maxlength: 500 },
      image: {
        type: String,
        required: true,
        trim: true,
        match: /^\/|https?:\/\//,
      },
    },

    howItWorks: {
      type: [HowItWorksSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one 'how it works' step is required.",
      },
    },

    wideRange: {
      title: { type: String, required: true, trim: true, maxlength: 150 },
      description: { type: String, required: true, trim: true, maxlength: 600 },
      images: {
        type: [String],
        validate: {
          validator: (arr) => arr.every((url) => /^\/|https?:\/\//.test(url)),
          message: "All image URLs must be valid paths or URLs.",
        },
      },
      video: {
        type: String,
        trim: true,
        match: /^\/|https?:\/\//,
      },
    },
  },
  { timestamps: true }
);

export const About = mongoose.model("About", AboutSchema);
