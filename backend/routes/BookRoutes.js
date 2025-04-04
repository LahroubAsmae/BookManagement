import express from "express";
import {
  getBooks,
  setBooks,
  updateBooks,
  deleteBooks,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/", getBooks);
router.post("/", setBooks);
router.put("/:id", updateBooks);
router.delete("/:id", deleteBooks);
export default router;
