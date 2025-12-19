import mongoose from "mongoose";
const { Schema } = mongoose;

// Subdocument schema for each question-answer pair
const FaqItemSchema = new Schema(
  {
    q: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    a: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    }
  },
  { _id: false } // prevent extra _id for each item
);

// Category-level schema that groups items
const FaqCategorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    items: {
      type: [FaqItemSchema],
      default: []
    }
  },
  { _id: false }
);

// Top-level schema (you could also store one document per category)
const FaqSchema = new Schema(
  {
    faqs: {
      type: [FaqCategorySchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Faq = mongoose.model("Faq", FaqSchema);
