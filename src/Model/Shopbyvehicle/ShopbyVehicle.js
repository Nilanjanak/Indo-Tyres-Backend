import mongoose from "mongoose";
const { Schema } = mongoose;

const ShopByVehicleSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      match: /^\/|https?:\/\//, // allows relative or absolute image URLs
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    }},
  { timestamps: true })
  
export const ShopByVehicle = mongoose.model("ShopByVehicle", ShopByVehicleSchema);