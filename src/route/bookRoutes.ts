// src/routes/bookRoutes.ts

import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controller/bookController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware'; // <--- 1. මේ Import එක තියෙනවද බලන්න

const router = express.Router();

router.get('/', getBooks);
router.post('/', protect, adminOnly, upload.single('image'), createBook);

// --- 2. මේ පේළිය අනිවාර්යයෙන්ම මෙහෙම තියෙන්න ඕන ---
router.put('/:id', protect, adminOnly, upload.single('image'), updateBook); 

router.delete('/:id', protect, adminOnly, deleteBook);

export default router;