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

export const updateBook = asyncHandler(async (req, res) => {
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

  // Vérification plus permissive
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({
      success: false,
      error: `Champs autorisés : ${allowedUpdates.join(", ")}`,
    });
  }

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Livre non trouvé",
      });
    }

    // Mise à jour progressive pour déclencher les hooks
    updates.forEach((update) => (book[update] = req.body[update]));
    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      data: updatedBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      validationErrors: error.errors,
    });
  }
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
