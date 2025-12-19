import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument schema for each brand and its models
const VehicleBrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    models: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one model is required."
      }
    }
  },
  { _id: false }
);

// Main vehicle schema containing categories
const VehicleSchema = new Schema(
  {
    car: {
      type: [VehicleBrandSchema],
      default: []
    },
    twoWheeler: {
      type: [VehicleBrandSchema],
      default: []
    },
    truck: {
      type: [VehicleBrandSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", VehicleSchema);
