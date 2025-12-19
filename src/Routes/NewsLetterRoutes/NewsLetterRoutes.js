import express from "express";
import {
  createOrUpdateNewsletter,
  getNewsletter,
  subscribeToNewsletter,
  getAllSubscribers,
  removeSubscriber,
} from "../../Controller/NewsLetterController/NewsLetterController.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const NewsletterRouter = express.Router();

// Admin routes
NewsletterRouter.route("/")
  .get(getNewsletter)
  .post(authenticate, createOrUpdateNewsletter);

NewsletterRouter.get("/subscribers", authenticate, getAllSubscribers);
NewsletterRouter.delete("/subscribers", authenticate, removeSubscriber);

// Public route for subscribing
NewsletterRouter.post("/subscribe", subscribeToNewsletter);

export default NewsletterRouter;
