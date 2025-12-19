import { Faq } from "../../Model/Faq/Faq.js";

//
// ======================================================
// CREATE FAQ DOCUMENT
// ======================================================
export const createFaq = async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "FAQs must be a non-empty array.",
      });
    }

    const existing = await Faq.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "FAQ data already exists. Use update instead.",
      });
    }

    const faq = new Faq({ faqs });
    const savedFaq = await faq.save();

    res.status(201).json({
      success: true,
      message: "FAQ created successfully.",
      data: savedFaq,
    });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// GET ALL FAQ DATA
// ======================================================
export const getFaqs = async (req, res) => {
  try {
    const faq = await Faq.findOne();

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error fetching FAQ data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// UPDATE ENTIRE FAQ DOCUMENT
// ======================================================
export const updateFaq = async (req, res) => {
  try {
    const { faqs } = req.body;

    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({
        success: false,
        message: "FAQs must be a non-empty array.",
      });
    }

    const existing = await Faq.findOne();
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    existing.faqs = faqs;
    const updated = await existing.save();

    res.status(200).json({
      success: true,
      message: "FAQ data updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating FAQ data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE ENTIRE FAQ DOCUMENT
// ======================================================
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findOne();
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    await Faq.deleteOne({ _id: faq._id });

    res.status(200).json({
      success: true,
      message: "FAQ data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting FAQ data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// ADD NEW CATEGORY
// ======================================================
export const addCategory = async (req, res) => {
  try {
    const { category, items } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const faq = await Faq.findOne();
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    const exists = faq.faqs.find(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    faq.faqs.push({ category, items: items || [] });
    await faq.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully.",
      data: faq,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// ADD QUESTION TO CATEGORY
// ======================================================
export const addQuestion = async (req, res) => {
  try {
    const { category } = req.params;
    const { q, a } = req.body;

    if (!q || !a) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required.",
      });
    }

    const faq = await Faq.findOne();
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    const cat = faq.faqs.find(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );

    if (!cat) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    cat.items.push({ q, a });
    await faq.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully.",
      data: faq,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//
// ======================================================
// DELETE CATEGORY
// ======================================================
export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const faq = await Faq.findOne();
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ data not found.",
      });
    }

    const index = faq.faqs.findIndex(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    faq.faqs.splice(index, 1);
    await faq.save();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: faq,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
