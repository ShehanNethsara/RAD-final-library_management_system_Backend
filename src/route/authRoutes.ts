import express from 'express';
// imoport getAllUsers 
import { registerUser, authUser, getAllUsers } from '../controller/authController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

router.get('/users', protect, adminOnly, getAllUsers);

export default router;