import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controller/bookController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware'; 

const router = express.Router();

router.get('/', getBooks);
router.post('/', protect, adminOnly, upload.single('image'), createBook);

router.put('/:id', protect, adminOnly, upload.single('image'), updateBook); 

router.delete('/:id', protect, adminOnly, deleteBook);

export default router;