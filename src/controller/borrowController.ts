import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Borrow from '../model/Borrow'; 
import Book from '../model/Book';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private (User)
export const borrowBook = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookId, dueDate } = req.body;
  
  // TypeScript වලට කියනවා _id එක string එකක් විදිහට ගන්න කියලා
  const userId = req.user._id; 

  // 1. පොත තියෙනවද බලනවා
  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // 2. Stock තියෙනවද බලනවා
  if (book.availableCopies < 1) {
    res.status(400);
    throw new Error('Book is currently out of stock');
  }

  // 3. දැනටමත් අරගෙනද බලනවා
  const alreadyBorrowed = await Borrow.findOne({
    userId: userId, 
    bookId: bookId, 
    status: 'Borrowed',
  });

  if (alreadyBorrowed) {
    res.status(400);
    throw new Error('You have already borrowed this book');
  }

  // 4. Due Date හැදීම
  let finalDueDate = dueDate;
  if (!finalDueDate) {
    const d = new Date();
    d.setDate(d.getDate() + 7); 
    finalDueDate = d;
  }

  // 5. Save Record
  const borrow = await Borrow.create({
    userId: userId,
    bookId: bookId,
    dueDate: finalDueDate,
    status: 'Borrowed'
  });

  // 6. Update Book Stock
  if (borrow) {
    book.availableCopies = book.availableCopies - 1;
    await book.save();
    
    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow
    });
  } else {
    res.status(400);
    throw new Error('Invalid borrow data');
  }
});

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Private
export const returnBook = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const borrow = await Borrow.findById(id);

  if (!borrow) {
    res.status(404);
    throw new Error('Borrow record not found');
  }

  if (borrow.status === 'Returned') {
    res.status(400);
    throw new Error('Book already returned');
  }

  // --- නිවැරදි කළ කොටස ---
  borrow.status = 'Returned';
  borrow.returnDate = new Date(); // මෙතන returnedDate වෙනුවට returnDate දැම්මා
  await borrow.save();
  // ------------------------

  // Update Book Stock
  // (borrow as any) දාලා තියෙන්නේ TypeScript error එක නවත්තන්න
  const book = await Book.findById((borrow as any).bookId); 
  
  if (book) {
    book.availableCopies = book.availableCopies + 1;
    await book.save();
  }

  res.json({ message: 'Book returned successfully' });
});

// @desc    Get user's borrowed books
// @route   GET /api/borrow
// @access  Private
// src/controllers/borrowController.ts

export const getMyBorrows = asyncHandler(async (req: AuthRequest, res: Response) => {
  const borrows = await Borrow.find({ userId: req.user._id })
    .populate('bookId', 'title author imageUrl isbn') 
    .populate('userId', 'name email') // <--- මේක අලුතින් එකතු කළා (User ගේ නම සහ Email ගන්න)
    .sort({ createdAt: -1 });

  res.json(borrows);
});

// @desc    Get all borrows (Admin)
// @route   GET /api/borrow/all
// @access  Private (Admin)
export const getAllBorrows = asyncHandler(async (req: Request, res: Response) => {
  const borrows = await Borrow.find({})
    .populate('userId', 'name email')
    .populate('bookId', 'title author')
    .sort({ createdAt: -1 });

  res.json(borrows);
});