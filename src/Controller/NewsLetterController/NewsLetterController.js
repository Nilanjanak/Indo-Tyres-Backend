import { Newsletter } from "../../Model/NewsLetter/NewsLetter.js";

//
// =======================================
// Create or Update Newsletter Content
// =======================================
export const createOrUpdateNewsletter = async (req, res) => {
  try {
    const { title, subtitle, buttonText, isActive } = req.body;

    if (!title || !subtitle || !buttonText) {
      return res.status(400).json({
        success: false,
        error: "Title, subtitle, and button text are required",
      });
    }

    // Check if newsletter exists (there should typically be only one)
    let newsletter = await Newsletter.findOne();

    if (newsletter) {
      // Update existing newsletter
      newsletter.title = title;
      newsletter.subtitle = subtitle;
      newsletter.buttonText = buttonText;
      if (typeof isActive === "boolean") newsletter.isActive = isActive;

      await newsletter.save();

      return res.status(200).json({
        success: true,
        message: "Newsletter updated successfully",
        data: newsletter,
      });
    } else {
      // Create new newsletter
      const newNewsletter = new Newsletter({
        title,
        subtitle,
        buttonText,
        isActive,
      });

      const savedNewsletter = await newNewsletter.save();

      return res.status(201).json({
        success: true,
        message: "Newsletter created successfully",
        data: savedNewsletter,
      });
    }
  } catch (error) {
    console.error("❌ Error creating/updating newsletter:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Get Newsletter Content
// =======================================
export const getNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne();

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: "No newsletter found",
      });
    }

    return res.status(200).json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    console.error("❌ Error fetching newsletter:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Subscribe User (Public Endpoint)
// =======================================
export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "A valid email address is required",
      });
    }

    let newsletter = await Newsletter.findOne();

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: "Newsletter configuration not found",
      });
    }

    // Check if already subscribed
    const alreadySubscribed = newsletter.subscribers.some(
      (subscriber) => subscriber.email === email
    );

    if (alreadySubscribed) {
      return res.status(400).json({
        success: false,
        error: "This email is already subscribed",
      });
    }

    // Add new subscriber
    newsletter.subscribers.push({ email });
    await newsletter.save();

    return res.status(200).json({
      success: true,
      message: "Subscription successful",
      data: { email },
    });
  } catch (error) {
    console.error("❌ Error subscribing to newsletter:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Get All Subscribers (Admin Only)
// =======================================
export const getAllSubscribers = async (req, res) => {
  try {
    const newsletter = await Newsletter.findOne().select("subscribers");

    if (!newsletter || !newsletter.subscribers.length) {
      return res.status(404).json({
        success: false,
        message: "No subscribers found",
      });
    }

    return res.status(200).json({
      success: true,
      count: newsletter.subscribers.length,
      data: newsletter.subscribers,
    });
  } catch (error) {
    console.error("❌ Error fetching subscribers:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

//
// =======================================
// Remove Subscriber (Admin Only)
// =======================================
export const removeSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const newsletter = await Newsletter.findOne();

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: "Newsletter not found",
      });
    }

    const beforeCount = newsletter.subscribers.length;
    newsletter.subscribers = newsletter.subscribers.filter(
      (subscriber) => subscriber.email !== email
    );

    if (newsletter.subscribers.length === beforeCount) {
      return res.status(404).json({
        success: false,
        error: "Subscriber not found",
      });
    }

    await newsletter.save();

    return res.status(200).json({
      success: true,
      message: `Subscriber with email ${email} removed successfully`,
    });
  } catch (error) {
    console.error("❌ Error removing subscriber:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
