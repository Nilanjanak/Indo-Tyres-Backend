import { Growth } from "../../Model/Growth/Growth.js";



//
// ======================================================
// CREATE GROWTH RECORD
// ======================================================
export const createGrowth = async (req, res) => {
  try {
    const { year, growth } = req.body;

    if (!year || growth == null) {
      return res.status(400).json({
        success: false,
        message: "Year and growth are required.",
      });
    }

    const existing = await Growth.findOne({ year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Growth record for year ${year} already exists.`,
      });
    }

    const record = new Growth({ year, growth });
    const saved = await record.save();

    res.status(201).json({
      success: true,
      message: "Growth record created successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("Error creating growth record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// GET ALL GROWTH RECORDS
// ======================================================
export const getGrowth = async (req, res) => {
  try {
    const records = await Growth.find().sort({ year: 1 });

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No growth records found.",
      });
    }

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching growth records:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// GET SINGLE GROWTH RECORD BY YEAR
// ======================================================
export const getGrowthByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const record = await Growth.findOne({ year });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No growth record found for year ${year}.`,
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching growth record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// UPDATE GROWTH RECORD BY YEAR
// ======================================================
export const updateGrowth = async (req, res) => {
  try {
    const { year } = req.params;
    const { growth } = req.body;

    if (growth == null) {
      return res.status(400).json({
        success: false,
        message: "Growth value is required.",
      });
    }

    const record = await Growth.findOneAndUpdate(
      { year },
      { growth },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No growth record found for year ${year}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Growth record for year ${year} updated successfully.`,
      data: record,
    });
  } catch (error) {
    console.error("Error updating growth record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE GROWTH RECORD BY YEAR
// ======================================================
export const deleteGrowth = async (req, res) => {
  try {
    const { year } = req.params;

    const record = await Growth.findOneAndDelete({ year });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `No growth record found for year ${year}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Growth record for year ${year} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting growth record:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE ALL GROWTH RECORDS (ADMIN/RESET USE)
// ======================================================
export const deleteAllGrowth = async (req, res) => {
  try {
    await Growth.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All growth records deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting all growth records:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
