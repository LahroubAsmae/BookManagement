import asyncHandler from "express-async-handler";
import book from "../models/bookModel.js";
//Get books
export const getBook = asyncHandler(async (req, res) => {
  const Book = await book.find();
  res.status(200).json(Book);
});
//set books
export const setBook = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "please send a text" });
  }
  const Book = new book(req.body);
  await Book.save();
  res.status(200).json(Book);
});
//update books
export const updateBook = asyncHandler(async (req, res) => {
  // 1. Validation des champs
  const allowedUpdates = ["title", "author", "available"];
  const isValidOperation = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidOperation) {
    res.status(400);
    throw new Error("Invalid updates!");
  }

  // 2. Recherche et mise à jour
  const updatedBook = await book.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Retourne le document modifié
    runValidators: true, // ✅ Active la validation du schéma
  });

  // 3. Gestion du livre non trouvé
  if (!updatedBook) {
    res.status(404);
    throw new Error("Book not found");
  }

  // 4. Réponse
  res.status(200).json({
    success: true,
    data: updatedBook,
  });
});
//delete books
export const deleteBook = asyncHandler(async (req, res) => {
  //verifier if the book exist
  const existingBook = await book.findById(req.params.id);
  if (!existingBook) {
    res.status(404);
    throw new Error("Book don't exist");
  }
  const deletedBook = await book.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Book deleted",
    data: deleteBook,
  });
});
