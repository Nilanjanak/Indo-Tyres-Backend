import mongoose from "mongoose";
const { Schema } = mongoose;

// Each yearly growth record
const GrowthItemSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100
    },
    growth: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true,
 
  }
);

// Main schema — single document holding the entire array


export const Growth = mongoose.model("Growth", GrowthItemSchema);
