import express, { Request, Response } from 'express';
import { getUserNotifications, getOverdueBooks } from '../controller/notificationController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// User ට notification බලන්න
router.get('/user-alerts', protect, getUserNotifications);

// Admin ට කල් ඉකුත් වූ ලිස්ට් එක බලන්න
// router.get('/admin-overdue', protect, adminOnly, getOverdueBooks);

export default router;