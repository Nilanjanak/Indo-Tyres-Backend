import os from "os";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

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

// Env Set up
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// ✅ REQUIRED on Render (NO LOGIC CHANGE)
app.set("trust proxy", 1);

// ✅ Path helpers (needed only for static files)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract the local IP
function getLocalIP() {
  const net = os.networkInterfaces();
  for (const key in net) {
    for (const iface of net[key]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "127.0.0.1";
}

const localIP = getLocalIP();

// ============================================
// ✅ CORS CONFIGURATION (UNCHANGED LOGIC)
// ============================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  "https://indoconnect.co.in",
  "https://www.indoconnect.co.in",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        console.log("🚫 CORS Blocked:", origin);
        callback(new Error("CORS Blocked: " + origin));
      }
    },
    credentials: true,
  })
);

// Middlewares (UNCHANGED)
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅🔥 ONLY ADDITION FOR IMAGES
// Images will now load from:
// https://indo-tyres-backend.onrender.com/uploads/<filename>
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Api End points (UNCHANGED)
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

console.log("DB URI:", process.env.DB_URI ? "Provided" : "Missing");
console.log("DB Name:", process.env.DB_NAME);

// Db connection setup
DB_Connection(process.env.DB_URI, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Local:    http://localhost:${PORT}`);
      console.log(`Network:  http://${localIP}:${PORT}`);
    });
  })
  .catch((err) => console.error("Database Connection Failed:", err));
