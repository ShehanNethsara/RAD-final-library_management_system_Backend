// import express from 'express';
// import { registerUser, loginUser } from '../controller/authController';


// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// export default router;
// src/routes/authRoutes.ts

import express from 'express';
// getAllUsers එකත් import කරගන්න
import { registerUser, authUser, getAllUsers } from '../controller/authController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);

// --- අලුත් Route එක (Get All Users) ---
router.get('/users', protect, adminOnly, getAllUsers);

export default router;