import { Request, Response } from 'express';
import Borrow from '../model/Borrow';
import Book from '../model/Book';

// @desc    Borrow a book
// @route   POST /api/borrow
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { bookId, userId, dueDate } = req.body;

    // 1. පොත හොයාගන්නවා
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 2. පොතේ පිටපත් ඉතුරු වෙලා තියෙනවද බලනවා
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // 3. Borrow record එක හදනවා
    const borrow = new Borrow({
      bookId,
      userId,
      dueDate,
      status: 'Borrowed'
    });

    await borrow.save();

    // 4. පොතේ available copy ගාන අඩු කරනවා
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(borrow);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/return/:borrowId
export const returnBook = async (req: Request, res: Response) => {
  try {
    const { borrowId } = req.params;

    // 1. Borrow record එක හොයාගන්නවා
    const borrow = await Borrow.findById(borrowId);

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    if (borrow.status === 'Returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // 2. Return record එක update කරනවා
    borrow.status = 'Returned';
    borrow.returnDate = new Date(); // අද දවස දානවා

    // 3. දඩ මුදල් ගණනය කිරීම (Optional)
    // Due Date එක පහු වෙලා නම් දවසට රු. 10 ගානේ
    const today = new Date();
    if (today > borrow.dueDate) {
      const diffTime = Math.abs(today.getTime() - borrow.dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      borrow.fine = diffDays * 10; // දවසට 10 බැගින්
    }

    await borrow.save();

    // 4. පොතේ copy ගාන ආයේ වැඩි කරනවා
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ message: 'Book returned successfully', fine: borrow.fine });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};