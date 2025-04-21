import Borrowing from '../models/borrowingModel.js';
import Book from '../models/bookModel.js';

// @desc    Emprunter un livre
// @route   POST /api/borrowings
// @access  Private
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Vérifier si le livre existe et est disponible
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    
    if (!book.available) {
      return res.status(400).json({ message: 'Le livre n\'est pas disponible pour l\'emprunt' });
    }
    
    // Calculer la date d'échéance (par exemple, 14 jours à partir de maintenant)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    // Créer un enregistrement d'emprunt
    const borrowing = new Borrowing({
      user: req.user._id,
      book: bookId,
      dueDate
    });
    
    // Mettre à jour la disponibilité du livre
    book.available = false;
    
    // Enregistrer les deux documents
    await borrowing.save();
    await book.save();
    
    res.status(201).json({
      message: 'Livre emprunté avec succès',
      borrowing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Retourner un livre
// @route   PUT /api/borrowings/:id/return
// @access  Private
export const returnBook = async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Enregistrement d\'emprunt non trouvé' });
    }
    
    // Vérifier si le livre est déjà retourné
    if (borrowing.isReturned) {
      return res.status(400).json({ message: 'Le livre est déjà retourné' });
    }
    
    // Vérifier si l'utilisateur est celui qui a emprunté le livre
    if (borrowing.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Utilisateur non autorisé' });
    }
    
    // Mettre à jour l'enregistrement d'emprunt
    borrowing.isReturned = true;
    borrowing.returnDate = Date.now();
    
    // Mettre à jour la disponibilité du livre
    const book = await Book.findById(borrowing.book);
    book.available = true;
    
    // Enregistrer les deux documents
    await borrowing.save();
    await book.save();
    
    res.json({
      message: 'Livre retourné avec succès',
      borrowing
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir l'historique d'emprunt de l'utilisateur
// @route   GET /api/borrowings/myborrowings
// @access  Private
export const getMyBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ user: req.user._id })
      .populate('book', 'title author coverImage')
      .sort({ borrowDate: -1 });
    
    res.json(borrowings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir tous les emprunts
// @route   GET /api/borrowings
// @access  Private/Admin
export const getAllBorrowings = async (req, res) => {
  try {
    const borrowings = await Borrowing.find({})
      .populate('user', 'name email')
      .populate('book', 'title author')
      .sort({ borrowDate: -1 });
    
    res.json(borrowings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};