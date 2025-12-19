import mongoose from "mongoose";
const { Schema } = mongoose;

const NewsletterSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    buttonText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    // Optional: if you want to store subscriber emails
    subscribers: [
      {
        email: {
          type: String,
          trim: true,
          lowercase: true,
          match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
        },
        subscribedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model("Newsletter", NewsletterSchema);
