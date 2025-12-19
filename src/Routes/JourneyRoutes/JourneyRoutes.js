import express from "express";
import {
  createOrUpdateJourney,
  getJourney,
  addMilestone,
  updateMilestone,
  deleteMilestone
} from "../../Controller/JourneyController/JourneyController.js";

const JourneyRouter = express.Router();

JourneyRouter.route("/")
  .post(createOrUpdateJourney)
  .get(getJourney);

JourneyRouter.post("/add", addMilestone);
JourneyRouter.put("/update/:index", updateMilestone);
JourneyRouter.delete("/delete/:index", deleteMilestone);

export default JourneyRouter;
