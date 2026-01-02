import express from 'express';
// කලින් දුන්න borrowController එක මෙතනට import කරන්න
import { borrowBook } from '../controller/borrowController'; 
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// පොත් ගන්න (User & Admin පුළුවන්) - දවස් 7 Logic එක තියෙන්නේ borrowBook function එක ඇතුලේ
router.post('/', protect, borrowBook);

export default router;