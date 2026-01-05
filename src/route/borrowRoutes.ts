import express from 'express';
// 1. getAllBorrows import කරන්න (අන්තිමට තියෙන function එක)
import { borrowBook, getMyBorrows, returnBook, getAllBorrows } from '../controller/borrowController';
import { protect, adminOnly } from '../middleware/authMiddleware'; // adminOnly import කරන්න

const router = express.Router();

router.post('/:bookId', protect, borrowBook);
router.get('/my-borrows', protect, getMyBorrows);
router.put('/:borrowId/return', protect, returnBook);

// 2. අලුත් Admin Route එක
router.get('/', protect, adminOnly, getAllBorrows);

export default router;