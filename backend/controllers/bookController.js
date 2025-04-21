import asyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";

// Get all books
export const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
});

// Get book by ID
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Livre non trouvé");
  }

  res.status(200).json(book);
});

// Create new book
export const setBook = asyncHandler(async (req, res) => {
  const { title, author, description, genre, publishedYear, isbn, coverImage } =
    req.body;

  // Validation
  if (!title || !author) {
    res.status(400);
    throw new Error("Veuillez fournir au moins un titre et un auteur");
  }

  const book = new Book({
    title,
    author,
    description,
    genre,
    publishedYear,
    isbn,
    coverImage,
    available: true, // Par défaut, un nouveau livre est disponible
  });

  await book.save();
  res.status(201).json(book);
});

// Update book
export const updateBook = asyncHandler(async (req, res) => {
  // 1. Validation des champs
  const allowedUpdates = [
    "title",
    "author",
    "description",
    "genre",
    "publishedYear",
    "isbn",
    "coverImage",
    "available",
  ];

  const isValidOperation = Object.keys(req.body).every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidOperation) {
    res.status(400);
    throw new Error("Mises à jour invalides!");
  }

  // 2. Recherche et mise à jour
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Retourne le document modifié
    runValidators: true, // Active la validation du schéma
  });

  // 3. Gestion du livre non trouvé
  if (!updatedBook) {
    res.status(404);
    throw new Error("Livre non trouvé");
  }

  // 4. Réponse
  res.status(200).json(updatedBook);
});

// Delete book
export const deleteBook = asyncHandler(async (req, res) => {
  // Vérifier si le livre existe
  const existingBook = await Book.findById(req.params.id);
  if (!existingBook) {
    res.status(404);
    throw new Error("Livre non trouvé");
  }

  const deletedBook = await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Livre supprimé avec succès",
    data: deletedBook,
  });
});

// Search books
export const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "Veuillez fournir un terme de recherche" });
  }

  const books = await Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { author: { $regex: query, $options: "i" } },
      { genre: { $regex: query, $options: "i" } },
    ],
  });

  res.status(200).json(books);
});

// Update book availability
export const updateBookAvailability = asyncHandler(async (req, res) => {
  const { available } = req.body;

  if (available === undefined) {
    res.status(400);
    throw new Error("Veuillez spécifier la disponibilité du livre");
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error("Livre non trouvé");
  }

  book.available = available;
  await book.save();

  res.status(200).json(book);
});
