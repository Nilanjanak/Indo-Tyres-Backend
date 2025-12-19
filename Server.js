import os from "os";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import DB_Connection from "./src/Db/Db.js";

import UserRouter from "./src/Routes/UserRoutes/UserRoutes.js";
import TyreRouter from "./src/Routes/TyreRoutes/TyreRoutes.js";
import FooterRouter from "./src/Routes/FooterRoutes/FooterRoutes.js";
import TrustedStoryrouter from "./src/Routes/TrustedStoryRoutes/TrustedStoryRoutes.js";
import TestimonialRouter from "./src/Routes/TestimonialRoutes/TestimonialRoutes.js";
import StoryRouter from "./src/Routes/StoryRoutes/StoryRoutes.js";
import NewsletterRouter from "./src/Routes/NewsLetterRoutes/NewsLetterRoutes.js";
import JourneyRouter from "./src/Routes/JourneyRoutes/JourneyRoutes.js";
import HeroSectionRouter from "./src/Routes/HeroRoutes/HeroRoutes.js";
import GrowthRouter from "./src/Routes/GrowthRoutes/GrowthRoutes.js";
import FaqRouter from "./src/Routes/FaqRoutes/FaqRoutes.js";
import EnquiryRouter from "./src/Routes/EnquiryRoutes/EnquiryRoutes.js";
import AboutRouter from "./src/Routes/AboutRoutes/AboutRoutes.js";
import ShopbyVehiclerouter from "./src/Routes/ShopbyVehicle/ShopbyVehicle.js";
import ReviewRouter from "./src/Routes/ReviewRoutes/ReviewRoutes.js";
import ContactRouter from "./src/Routes/Contact/Contact.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

/* --------------------------------------------------
   TRUST PROXY (CRITICAL FOR RENDER + SECURE COOKIES)
-------------------------------------------------- */
app.set("trust proxy", 1);

/* --------------------------------------------------
   LOCAL IP (DEV ONLY)
-------------------------------------------------- */
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const key in nets) {
    for (const net of nets[key]) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}
const localIP = getLocalIP();

/* --------------------------------------------------
   ALLOWED ORIGINS (CLEAN & SAFE)
-------------------------------------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  "https://indoconnect.co.in",
  "https://www.indoconnect.co.in",
  process.env.FRONTEND_URL,
].filter(Boolean); // 🔥 REMOVE undefined

/* --------------------------------------------------
   CORS CONFIG (PRODUCTION SAFE)
-------------------------------------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("🚫 CORS BLOCKED:", origin);
      callback(new Error("CORS Blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Explicit preflight support
app.options("*", cors());

/* --------------------------------------------------
   MIDDLEWARES
-------------------------------------------------- */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/tyre", TyreRouter);
app.use("/api/v1/trustedstory", TrustedStoryrouter);
app.use("/api/v1/testimonial", TestimonialRouter);
app.use("/api/v1/story", StoryRouter);
app.use("/api/v1/newsletter", NewsletterRouter);
app.use("/api/v1/journey", JourneyRouter);
app.use("/api/v1/hero", HeroSectionRouter);
app.use("/api/v1/growth", GrowthRouter);
app.use("/api/v1/footer", FooterRouter);
app.use("/api/v1/faq", FaqRouter);
app.use("/api/v1/enquiry", EnquiryRouter);
app.use("/api/v1/about", AboutRouter);
app.use("/api/v1/sbv", ShopbyVehiclerouter);
app.use("/api/v1/review", ReviewRouter);
app.use("/api/v1/contact", ContactRouter);

/* --------------------------------------------------
   DB CONNECTION
-------------------------------------------------- */
console.log("DB URI:", process.env.DB_URI ? "Provided" : "Missing");
console.log("DB Name:", process.env.DB_NAME || "Missing");

DB_Connection(process.env.DB_URI, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:", err);
    process.exit(1);
  });
