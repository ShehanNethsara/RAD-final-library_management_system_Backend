import express from 'express';
import { getUsers, deleteUser } from '../controller/userController'; 
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;