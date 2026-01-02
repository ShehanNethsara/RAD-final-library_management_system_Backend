import { Request, Response } from 'express';
import { Book, Borrow } from '../model/Library';

// User: පොතක් ලබා ගැනීම (Borrow)
export const borrowBook = async (req: any, res: Response) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book || !book.available) return res.status(400).json({ msg: "පොත ලබාගත නොහැක." });

    const newBorrow = new Borrow({ userId, bookId });
    await newBorrow.save();

    // පොත ලබාගත නොහැකි ලෙස update කිරීම
    await Book.findByIdAndUpdate(bookId, { available: false });
    res.json({ message: "පොත ලබා ගැනීම සාර්ථකයි. දින 7ක් ඇතුළත භාර දෙන්න." });
};

// Notification Logic: 6 වන දින සහ 7 වන දින වාර්තා
export const checkNotifications = async (req: Request, res: Response) => {
    const today = new Date();
    
    // දින 6 කින් පසු (හෙට expire වන පොත්)
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const reminders = await Borrow.find({
        dueDate: { $lte: tomorrow, $gte: today },
        status: 'borrowed'
    }).populate('userId bookId');

    // Admin: දින 7 ඉක්මවූ (Overdue) පොත් ලැයිස්තුව
    const overdue = await Borrow.find({
        dueDate: { $lt: today },
        status: 'borrowed'
    }).populate('userId bookId');

    res.json({ reminders, overdue });
};