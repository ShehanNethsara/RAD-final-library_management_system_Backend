import { Response } from 'express';
import Borrow from '../model/Borrow';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. User Notification 6 day
export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const borrows = await Borrow.find({ userId, status: 'Borrowed' }).populate('bookId');

    const alerts = borrows.filter((borrow) => {
      const due = new Date(borrow.dueDate);
      
      return due.toDateString() === tomorrow.toDateString() || due <= today;
    });

    res.json(alerts); 
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//  Admin Notification 
export const getOverdueBooks = async (req: Request, res: Response) => {
  try {
    const today = new Date();

    const overdueBooks = await Borrow.find({
      dueDate: { $lt: today }, 
      status: 'Borrowed'
    }).populate('bookId userId'); 

    res.json(overdueBooks); 
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};