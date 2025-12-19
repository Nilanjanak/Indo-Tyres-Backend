import { Journey } from "../../Model/Journey/Journey.js";

//
// ======================================================
// CREATE OR UPDATE ENTIRE JOURNEY
// ======================================================
export const createOrUpdateJourney = async (req, res) => {
  try {
    const { journey } = req.body;

    if (!journey || !Array.isArray(journey) || journey.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Journey must contain at least one milestone.",
      });
    }

    let journeyData = await Journey.findOne();

    if (!journeyData) {
      // Create new journey
      journeyData = new Journey({ journey });
    } else {
      // Update existing journey
      journeyData.journey = journey;
    }

    const savedJourney = await journeyData.save();

    res.status(201).json({
      success: true,
      message: "Journey created/updated successfully.",
      data: savedJourney,
    });
  } catch (error) {
    console.error("Error in createOrUpdateJourney:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// GET FULL JOURNEY
// ======================================================
export const getJourney = async (req, res) => {
  try {
    const journeyData = await Journey.findOne();

    if (!journeyData) {
      return res.status(404).json({
        success: false,
        message: "No journey data found.",
      });
    }

    res.status(200).json({
      success: true,
      data: journeyData,
    });
  } catch (error) {
    console.error("Error in getJourney:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// ADD MILESTONE (YEAR + EVENT)
// ======================================================
export const addMilestone = async (req, res) => {
  try {
    const { year, event } = req.body;

    if (!year || !event) {
      return res.status(400).json({
        success: false,
        message: "Both year and event are required.",
      });
    }

    let journeyData = await Journey.findOne();

    if (!journeyData) {
      journeyData = new Journey({ journey: [{ year, event }] });
    } else {
      journeyData.journey.push({ year, event });
    }

    await journeyData.save();

    res.status(201).json({
      success: true,
      message: "Milestone added successfully.",
      data: journeyData,
    });
  } catch (error) {
    console.error("Error in addMilestone:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// UPDATE MILESTONE BY INDEX
// ======================================================
export const updateMilestone = async (req, res) => {
  try {
    const { index } = req.params;
    const { year, event } = req.body;

    const journeyData = await Journey.findOne();

    if (!journeyData) {
      return res.status(404).json({
        success: false,
        message: "Journey not found.",
      });
    }

    if (index < 0 || index >= journeyData.journey.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid milestone index.",
      });
    }

    if (year) journeyData.journey[index].year = year;
    if (event) journeyData.journey[index].event = event;

    await journeyData.save();

    res.status(200).json({
      success: true,
      message: "Milestone updated successfully.",
      data: journeyData,
    });
  } catch (error) {
    console.error("Error in updateMilestone:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE MILESTONE BY INDEX
// ======================================================
export const deleteMilestone = async (req, res) => {
  try {
    const { index } = req.params;

    const journeyData = await Journey.findOne();

    if (!journeyData) {
      return res.status(404).json({
        success: false,
        message: "Journey not found.",
      });
    }

    if (index < 0 || index >= journeyData.journey.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid milestone index.",
      });
    }

    journeyData.journey.splice(index, 1);
    await journeyData.save();

    res.status(200).json({
      success: true,
      message: "Milestone deleted successfully.",
      data: journeyData,
    });
  } catch (error) {
    console.error("Error in deleteMilestone:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
