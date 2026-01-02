import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './route/authRoutes';
import bookRoutes from './route/bookRoutes';
import borrowRoutes from './route/borrowRoutes';
// Notification routes එකත් මෙතනට දාගන්න පුළුවන් කලින් දුන්න විදිහට

import { notFound, errorHandler } from './middleware/errorMiddlewar';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Error Middleware (අන්තිමටම දාන්න)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});