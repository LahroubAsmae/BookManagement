import express from "express";
import {
  getBooks,
  getBookById,
  setBook,
  updateBook,
  deleteBook,
  searchBooks,
  updateBookAvailability,
} from "../controllers/bookController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBooks).post(protect, admin, setBook);

router.route("/search").get(searchBooks);

router
  .route("/:id")
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

router.route("/:id/availability").put(protect, admin, updateBookAvailability);

export default router;
