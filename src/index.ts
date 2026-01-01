import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';

// Routes Imports
import authRoutes from './route/authRoutes';
import bookRoutes from './route/bookRoutes';
import borrowRoutes from './route/borrowRoutes';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddlewar';

// 1. Config Setup
dotenv.config(); // .env ෆයිල් එක කියවන්න

// 2. Database Connection
connectDB();

// 3. Initialize App
const app: Express = express();
const PORT = process.env.PORT || 5000;

// 4. Middleware & CORS Setup
// මෙතන තමයි ඔයාගේ frontend URL එක දෙන්නේ
app.use(cors({
  origin: 'http://localhost:5173', // Vite Frontend URL එක
  credentials: true, // Cookies හෝ Authorization headers යවනවා නම් මේක ඕන
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // අවසර දෙන මෙතඩ්ස්
  allowedHeaders: ['Content-Type', 'Authorization'] // අවසර දෙන Headers
}));

app.use(express.json()); // JSON දත්ත කියවන්න (Body Parser)

// 5. Routes Mounting
app.use('/api/auth', authRoutes);     // Login & Register
app.use('/api/books', bookRoutes);    // Book CRUD
app.use('/api/borrow', borrowRoutes); // Issue/Return Books

// Root Route (Server එක වැඩද බලන්න)
app.get('/', (req: Request, res: Response) => {
  res.send('Library Management System API is Running...');
});

// 6. Error Handling (අනිවාර්යයෙන්ම Routes වලට පස්සේ)
app.use(notFound); // වැරදි URL
app.use(errorHandler); // Server Errors

// 7. Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});