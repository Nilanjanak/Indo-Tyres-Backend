import mongoose from "mongoose";
const { Schema } = mongoose;

// Reusable schema for navigation links
const LinkSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    path: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    }
  },
  { _id: false }
);

// Schema for grouped link sections (Quick Links, Support, etc.)
const LinkSectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    links: {
      type: [LinkSchema],
      default: []
    }
  },
  { _id: false }
);

// Contact information schema
const ContactInfoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true }
  },
  { _id: false }
);

// Social link schema
const SocialLinkSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

// Company info schema
const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

// Main Footer schema
const FooterSchema = new Schema(
  {
    company: {
      type: CompanySchema,
      required: true
    },
    quickLinks: {
      type: LinkSectionSchema,
      required: true
    },
    supportLinks: {
      type: LinkSectionSchema,
      required: true
    },
    contactInfo: {
      type: ContactInfoSchema,
      required: true
    },
    socialLinks: {
      type: [SocialLinkSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const Footer = mongoose.model("Footer", FooterSchema);
