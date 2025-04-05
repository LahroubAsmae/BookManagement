import express from "express";
import {
  getBook,
  setBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
const router = express.Router();

router.get("/", getBook);
router.post("/", setBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
export default router;
