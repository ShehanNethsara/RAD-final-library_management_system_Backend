import { Request, Response } from 'express';
import Borrow from '../model/Borrow';
import Book from '../model/Book';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. පොතක් Borrow කිරීම (දවස් 7ක් දෙනවා)
export const borrowBook = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // පොත තියෙනවද බලනවා
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // දවස් 7ක් එකතු කරන Logic එක
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); // අද ඉඳන් දවස් 7ක්

    const borrow = await Borrow.create({
      bookId,
      userId,
      borrowDate,
      dueDate, // මෙතන save වෙනවා
      status: 'Borrowed'
    });

    // පොත් ගාන අඩු කරනවා
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(borrow);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};