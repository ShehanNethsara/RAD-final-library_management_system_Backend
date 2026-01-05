import { Request, Response } from 'express';
import Book from '../model/Book';
import { AuthRequest } from '../middleware/authMiddleware';
import asyncHandler from 'express-async-handler'

// Get Books (Public)
// Search ෆිල්ටර් එකක් දාලා තියෙන්නේ, පස්සේ ඕන වෙයි.
export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 }); // අලුත්ම පොත් උඩින් එන්න
  res.json(books);
};

// Add Book (Admin Only) - Updated with new features
export const createBook = async (req: AuthRequest, res: Response) => {
  const { 
    title, 
    author, 
    isbn, 
    category, 
    totalCopies, 
    // අලුත් දත්ත ටික මෙතනට ගන්නවා
    imageUrl, 
    description, 
    publisher, 
    publishedYear, 
    language, 
    shelfLocation 
  } = req.body;

  // ISBN එක කලින් තියෙනවද බලනවා (Validation)
  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    return res.status(400).json({ message: 'Book with this ISBN already exists' });
  }

  const book = await Book.create({
    title, 
    author, 
    isbn, 
    category, 
    totalCopies, 
    availableCopies: totalCopies, // මුලින්ම available ගාණ total ගාණමයි
    
    // අලුත් දත්ත ටික save කරනවා
    imageUrl, 
    description, 
    publisher, 
    publishedYear, 
    language, 
    shelfLocation
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400).json({ message: 'Invalid book data' });
  }
};

////
// Update Book (Admin Only) - Updated
// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { title, author, isbn, category, totalCopies, availableCopies, imageUrl, shelfLocation } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.imageUrl = imageUrl || book.imageUrl;
    book.shelfLocation = shelfLocation || book.shelfLocation;
    
    // --- මෙන්න මේ කොටස් දෙක අනිවාර්යයෙන්ම තියෙන්න ඕන ---
    // අංකයක් එනවා නම් ඒක ගන්න, නැත්නම් පරණ එකම තියන්න
    if (totalCopies !== undefined) book.totalCopies = Number(totalCopies);
    if (availableCopies !== undefined) book.availableCopies = Number(availableCopies);

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// Delete Book (Admin Only)
export const deleteBook = async (req: Request, res: Response) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book removed' });
};