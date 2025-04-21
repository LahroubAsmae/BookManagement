import express from "express";
export const userRouter = express.Router();
import {
  getUserProfile,
  RegisterUser,
  LoginUser,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
userRouter.post("/", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.get("/profile", protect, getUserProfile);
