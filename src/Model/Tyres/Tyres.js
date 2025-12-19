import mongoose from "mongoose";
const { Schema } = mongoose;

const TyreSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["Car", "Bike", "Truck", "Bus", "SUV", "Other"],
      required: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
    },

    discount: {
      type: String,
      default: null,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    dealer: {
      type: String,
      trim: true,
    },

    stock: {
      type: Boolean,
      default: true,
    },

    popular: {
      type: Boolean,
      default: false,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    enquiries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enquiry",
      },
    ],

    image: [
      {
        type: String,
        required: true,
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
 
  }
);


export const Tyre = mongoose.model("Tyre", TyreSchema);
