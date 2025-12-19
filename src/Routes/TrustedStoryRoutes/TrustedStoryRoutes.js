import express from "express";
import {
  createTrustedStory,
  getAllTrustedStories,
  getTrustedStoryById,
  updateTrustedStory,
  deleteTrustedStory,
} from "../../Controller/TrustedStoriesController/TrustedStoriesController.js";
import { upload } from "../../Middlewares/Multer.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const TrustedStoryrouter = express.Router();
const uploadMiddleware = upload.single("story_img");

// TrustedStoryrouter.use(authenticate);

TrustedStoryrouter
  .route("/")
  .post(authenticate,uploadMiddleware, createTrustedStory)
  .get(getAllTrustedStories);

TrustedStoryrouter
  .route("/:id")
  .get(getTrustedStoryById)
  .patch(authenticate, uploadMiddleware, updateTrustedStory)
  .delete(authenticate,deleteTrustedStory);

export default TrustedStoryrouter;
