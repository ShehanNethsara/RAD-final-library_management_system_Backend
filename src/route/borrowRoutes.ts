import express from 'express';
// borrowBook, getMyBorrows සහ returnBook කියන තුනම import කරගන්න
import { borrowBook, getMyBorrows, returnBook } from '../controller/borrowController'; 
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// --- Main Borrow Routes (/) ---
router.route('/')
  .post(protect, borrowBook)    // POST: පොතක් ගන්න (Borrow)
  .get(protect, getMyBorrows);  // GET:  මම ගත්ත පොත් ටික බලන්න (My Borrows History)

// --- Return Book Route (/return/:id) ---
// PUT: පොතක් ආපහු භාර දෙනකොට (Id එක විදිහට එන්නේ Borrow Record ID එක)
router.put('/return/:id', protect, returnBook);

export default router;