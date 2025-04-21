import express from "express";
import {
  borrowBook,
  returnBook,
  getMyBorrowings,
  getAllBorrowings,
} from "../controllers/borrowingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, borrowBook)
  .get(protect, admin, getAllBorrowings);

router.get("/myborrowings", protect, getMyBorrowings);
router.put("/:id/return", protect, returnBook);

export default router;
