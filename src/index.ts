import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; // .js අයින් කළා

// වැදගත්: ඔයාගේ folder එකේ නම 'routes' ද 'route' ද කියලා බලන්න.
// මම මෙතන දාලා තියෙන්නේ 'routes' (plural) විදිහට.
import authRoutes from './route/authRoutes'; // .js අයින් කළා
import bookRoutes from './route/bookRoutes'; // .js අයින් කළා
import borrowRoutes from './route/borrowRoutes'; // .js අයින් කළා

import { notFound, errorHandler } from './middleware/errorMiddlewar'; // .js අයින් කළා

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Routes
// Folder එකේ නම අනුව මෙතනත් මාරු වෙන්න ඕන (route ද routes ද කියලා)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});