import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument schema for each milestone
const JourneyItemSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 5, // a little buffer for future events
    },
    event: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

// Main schema for company journey
const JourneySchema = new Schema(
  {
    journey: {
      type: [JourneyItemSchema],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Journey must contain at least one milestone.",
      },
    },
  },
  { timestamps: true }
);

export const Journey = mongoose.model("Journey", JourneySchema);
