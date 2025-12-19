import express from "express";
import { createEnquiry } from "../../Controller/EnquiryController/EnquiryController.js";
const EnquiryRouter = express.Router();

EnquiryRouter.post("/:id", createEnquiry);

export default EnquiryRouter;