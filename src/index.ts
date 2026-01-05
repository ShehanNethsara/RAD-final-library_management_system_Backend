import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Routes Imports (මේ ෆයිල් තුනම import කරගන්න)
import authRoutes from './route/authRoutes';
import bookRoutes from './route/bookRoutes';
import borrowRoutes from './route/borrowRoutes'; // <--- 1. මේක අනිවාර්යයි
import checkOverdueBooks from './cron/checkOverdue';
import path from 'path';

dotenv.config();
connectDB();
checkOverdueBooks();
const app = express();

app.use(cors());
app.use(express.json());

// Console Log එකක් දාමු Server එකට Request එනකොට පේන්න (Debug කරන්න ලේසියි)
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// --- Routes Mounting (මේ ටික හරියටම තියෙන්න ඕන) ---
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes); // <--- 2. මේ පේළිය නැත්නම් Borrow වැඩ කරන්නේ නෑ

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

