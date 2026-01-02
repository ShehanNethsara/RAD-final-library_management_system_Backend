import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './route/authRoutes';
import bookRoutes from './route/bookRoutes';
import borrowRoutes from './route/borrowRoutes';
import notificationRoutes from './route/notificationRoutes'; // අලුත් එක

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/notifications', notificationRoutes); // Notifications සම්බන්ධ කරන්න

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));