import express from "express";
import {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
  addCategory,
  addQuestion,
  deleteCategory
} from "../../Controller/FaqController/FaqController.js";

const FaqRouter = express.Router();

FaqRouter.route("/")
  .post(createFaq)
  .get(getFaqs)
  .put(updateFaq)
  .delete(deleteFaq);

// Manage categories
FaqRouter.post("/category", addCategory);
FaqRouter.delete("/category/:category", deleteCategory);

// Manage questions inside a category
FaqRouter.post("/category/:category/question", addQuestion);

export default FaqRouter;
