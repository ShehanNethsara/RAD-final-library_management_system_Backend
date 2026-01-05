import express from 'express';
// 1. returnBook function එක import කරන්න
import { borrowBook, getMyBorrows, returnBook } from '../controller/borrowController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/:bookId', protect, borrowBook);
router.get('/my-borrows', protect, getMyBorrows);

// 2. අලුත් Route එක (Return සඳහා)
router.put('/:borrowId/return', protect, returnBook);

export default router;