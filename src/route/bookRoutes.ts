import express from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from '../controller/bookController';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/roleMiddleware';

const router = express.Router();

// හැමෝටම පොත් ලිස්ට් එක බලන්න පුළුවන් (Public)
router.get('/', getBooks);

// තනි පොතක් බලන්න (Public)
router.get('/:id', getBookById);

// පොත් ඇතුලත් කරන්න (Admin Only)
router.post('/', protect, admin, createBook);

// පොත් වල විස්තර වෙනස් කරන්න (Admin Only)
router.put('/:id', protect, admin, updateBook);

// පොත් ඉවත් කරන්න (Admin Only)
router.delete('/:id', protect, admin, deleteBook);

export default router;