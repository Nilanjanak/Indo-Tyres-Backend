import mongoose from "mongoose";
import { SCHEMA } from "../../Utils/Constant.js";

const EnquirySchema = new SCHEMA(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    enquirie: {
      type: String,
      require: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tyre",
    }
  },{ timestamps: true }
);
export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
