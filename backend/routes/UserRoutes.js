import express from "express";
export const userRouter = express.Router();
import {
  getUserProfile,
  RegisterUser,
  LoginUser,
  getAllUsers,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";
userRouter.post("/", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/profile", protect, getUserProfile);
userRouter.get("/", protect, admin, getAllUsers); // ✅ Route admin
