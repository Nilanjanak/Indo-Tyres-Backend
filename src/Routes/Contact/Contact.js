import express from "express";
import { sendContactEmailGneral } from "../../Controller/Contact/Contact.js";

const ContactRouter = express.Router();

ContactRouter.route("/general").post(sendContactEmailGneral);
export default ContactRouter;