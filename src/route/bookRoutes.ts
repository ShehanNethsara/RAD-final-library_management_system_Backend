import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controller/bookController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

// --- වෙනස් කළ තැන (මෙතන protect තිබුණා නම් අයින් කරන්න) ---
router.get('/', getBooks); // හැමෝටම පොත් බලන්න පුළුවන් (Public)

// මේවාට Admin අවසරය ඕන
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;