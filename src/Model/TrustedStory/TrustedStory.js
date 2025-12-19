import mongoose from "mongoose";
const { Schema } = mongoose;

const TrustedStorySchema = new Schema({
  id: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  image: { type: String, required: true, trim: true, match: /^\/|https?:\/\// },
}, { timestamps: true });


export const TrustedStory = mongoose.model("TrustedStory", TrustedStorySchema);
