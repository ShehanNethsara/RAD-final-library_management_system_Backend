import express from 'express';
import { borrowBook, getMyBorrows, returnBook, getAllBorrows } from '../controller/borrowController';
import { protect, adminOnly } from '../middleware/authMiddleware'; // adminOnly import 

const router = express.Router();

router.post('/:bookId', protect, borrowBook);
router.get('/my-borrows', protect, getMyBorrows);
router.put('/:borrowId/return', protect, returnBook);

router.get('/', protect, adminOnly, getAllBorrows);

export default router;