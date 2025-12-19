import mongoose from "mongoose";
const { Schema } = mongoose;

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      match: /^\/|https?:\/\//,
    },
  },
  { timestamps: true }
);

export const Story = mongoose.model("Story", StorySchema);