import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import path from 'path';

// Routes Imports
import authRoutes from './route/authRoutes';
import bookRoutes from './route/bookRoutes';
import borrowRoutes from './route/borrowRoutes';
import userRoutes from './route/userRoutes'; // <--- 1. මේක Import කරන්න

// Scheduled Jobs
import checkOverdueBooks from './cron/checkOverdue';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Console Log for Debugging
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Uploads Folder එක Public කිරීම
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// --- Routes Mounting ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/users', userRoutes); // <--- 2. මේ පේළිය අනිවාර්යයෙන්ම තියෙන්න ඕන

// Start Cron Job
checkOverdueBooks();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));