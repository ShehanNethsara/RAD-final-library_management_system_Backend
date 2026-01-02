import { Response } from 'express';
import Borrow from '../model/Borrow';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. User Notification (දවස් 6කින් මතක් කිරීම)
// User Dashboard එකට ගියාම මේක call කරන්න
export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    
    // හෙට දවස (Today + 1 day)
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // තාම භාර දීපු නැති පොත් ගන්නවා
    const borrows = await Borrow.find({ userId, status: 'Borrowed' }).populate('bookId');

    const alerts = borrows.filter((borrow) => {
      const due = new Date(borrow.dueDate);
      // Due Date එක හෙට නම් හෝ අද නම් (Notification එක යවනවා)
      // සරලව: due date එකට තව දවසයි තියෙන්නේ
      return due.toDateString() === tomorrow.toDateString() || due <= today;
    });

    res.json(alerts); // මේ list එක Frontend එකේ පෙන්නන්න "හෙට පොත දෙන්න ඕන" කියලා
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Admin Notification (කල් ඉකුත් වූ පොත් - Overdue Books)
// Admin Dashboard එකට ගියාම මේක call කරන්න
export const getOverdueBooks = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    // Due Date පහු වුනා නම් සහ තාම දුන්නේ නැත්නම්
    const overdueBooks = await Borrow.find({
      dueDate: { $lt: today }, // අදට වඩා පරණ දින
      status: 'Borrowed'
    }).populate('bookId userId'); // පොතේ සහ යූසර්ගේ විස්තර එක්කම

    res.json(overdueBooks); // මේ ලිස්ට් එක Admin ට පෙන්නන්න
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};