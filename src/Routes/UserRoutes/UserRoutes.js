import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateSelf,
  deleteUser,
  logoutUser,
  DashboardData,
//   FetchAllData
} from "../../Controller/UseController/UserController.js";
import { authenticate } from "../../Middlewares/AuthMiddleware.js";

const UserRouter = express.Router();

// PUBLIC
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/logout", logoutUser);


UserRouter.use(authenticate);
// LOGGED-IN USER 
UserRouter.get("/me", getCurrentUser);
UserRouter.patch("/me/update", updateSelf);
UserRouter.delete("/:id", deleteUser);
UserRouter.get("/dashboard", authenticate, DashboardData);
export default UserRouter;