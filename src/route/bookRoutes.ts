import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controller/bookController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware'; // <--- Import කරන්න

const router = express.Router();

router.get('/', getBooks);

// --- වෙනස් කළ තැන: upload.single('image') මැදට දැම්මා ---
router.post('/', protect, adminOnly, upload.single('image'), createBook);

router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

export default router;