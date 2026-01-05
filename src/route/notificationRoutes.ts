import express, { Request, Response } from 'express';
import { getUserNotifications, getOverdueBooks } from '../controller/notificationController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// User  notification blnna
router.get('/user-alerts', protect, getUserNotifications);


export default router;