import express from 'express';
import { borrowBook, returnBook } from '../controller/borrowController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// පොතක් ඉල්ලුම් කරන්න (Login වී සිටීම අනිවාර්යයි)
// @route   POST /api/borrow
router.post('/', protect, borrowBook);

// පොතක් නැවත භාරදෙන්න (Login වී සිටීම අනිවාර්යයි)
// @route   PUT /api/borrow/return/:borrowId
router.put('/return/:borrowId', protect, returnBook);

export default router;