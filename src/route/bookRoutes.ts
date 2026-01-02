import express from 'express';
import { createBook, getBooks, updateBook, deleteBook } from '../controller/bookController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// ඕනෑම කෙනෙක්ට පොත් බලන්න පුළුවන් (Login වෙලා ඉන්න ඕන)
router.get('/', protect, getBooks);

// Admin ට විතරයි කරන්න පුළුවන් දේවල්
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;