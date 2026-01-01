// routes/bookRoutes.ts
import express from 'express';
import { getBooks, addBook } from '../controller/bookController';

const router = express.Router();

// GET ඉල්ලීමක් ආවොත් getBooks දුවන්න, POST ආවොත් addBook දුවන්න
router.get('/', getBooks);
router.post('/', addBook);

export default router;