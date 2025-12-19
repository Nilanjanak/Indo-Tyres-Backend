import express from "express";
import {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} from "../../Controller/StoriesController/StoriesController.js";
import { upload } from "../../Middlewares/Multer.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const StoryRouter = express.Router();

// Single image upload middleware
const uploadMiddleware = upload.single("story_img");

// CRUD Routes
StoryRouter.route("/")
  .get(getAllStories)
  .post(authenticate, uploadMiddleware, createStory);

StoryRouter.route("/:id")
  .get(getStoryById)
  .patch(authenticate, uploadMiddleware, updateStory)
  .delete(authenticate, deleteStory);

export default StoryRouter;
