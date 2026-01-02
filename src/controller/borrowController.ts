import { Request, Response } from 'express';
import Borrow from '../model/Borrow';
import Book from '../model/Book';
import { AuthRequest } from '../middleware/authMiddleware'; // User ID එක ගන්න මේක ඕන

// @desc    Borrow a book (Set Due Date to 7 days later)
// @route   POST /api/borrow
// @access  Private (User/Admin)
export const borrowBook = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // Login වෙලා ඉන්න User ගේ ID එක

    // 1. පොත සිස්ටම් එකේ තියෙනවද බලනවා
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 2. පොතේ පිටපත් (Copies) ඉතුරු වෙලා තියෙනවද බලනවා
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book is currently out of stock' });
    }

    // 3. User දැනටමත් මේ පොත අරගෙනද බලනවා (Optional Validation)
    const alreadyBorrowed = await Borrow.findOne({ 
      userId, 
      bookId, 
      status: 'Borrowed' 
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    // 4. දින 7ක් එකතු කිරීමේ Logic එක (Due Date Calculation)
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); // අද ඉඳන් දවස් 7ක් ඉස්සරහට

    // 5. Borrow Record එක Database එකේ Save කරනවා
    const borrow = await Borrow.create({
      bookId,
      userId,
      borrowDate,
      dueDate,
      status: 'Borrowed'
    });

    // 6. පොතේ available copy ගාන එකකින් අඩු කරනවා
    book.availableCopies = book.availableCopies - 1;
    await book.save();

    res.status(201).json({
      message: 'Book borrowed successfully',
      dueDate: dueDate, // Frontend එකට Due Date එක යවනවා පෙන්නන්න ලේසි වෙන්න
      borrow
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Private (Usually Admin or User via System)
export const returnBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Borrow Record ID (not Book ID)

    // 1. Borrow Record එක හොයාගන්නවා
    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // 2. දැනටමත් භාරදීලා නම් Error එකක් දෙනවා
    if (borrow.status === 'Returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // 3. Return Date එක සහ Status Update කරනවා
    borrow.status = 'Returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // 4. පොතේ Stock එක ආපහු වැඩි කරනවා
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.availableCopies = book.availableCopies + 1;
      await book.save();
    }

    res.json({ message: 'Book returned successfully' });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's borrow history
// @route   GET /api/borrow/my
// @access  Private (User)
export const getMyBorrows = async (req: AuthRequest, res: Response) => {
  try {
    // තමන්ගේ ID එකට අදාල Borrow list එක ගන්නවා (Book විස්තරත් එක්කම populate කරලා)
    const borrows = await Borrow.find({ userId: req.user._id })
      .populate('bookId', 'title author isbn') // පොතේ නම සහ කර්තෘ පෙන්වන්න
      .sort({ createdAt: -1 }); // අලුත් ඒවා උඩින්

    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all borrows (For Admin Dashboard)
// @route   GET /api/borrow
// @access  Private (Admin)
export const getAllBorrows = async (req: Request, res: Response) => {
  try {
    // ඔක්කොම විස්තර ගන්නවා User සහ Book විස්තරත් එක්ක
    const borrows = await Borrow.find({})
      .populate('userId', 'name email')
      .populate('bookId', 'title')
      .sort({ createdAt: -1 });

    res.json(borrows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};