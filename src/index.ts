import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import bookRoutes from './route/bookRoutes';

dotenv.config();

// Initialize App
const app: Express = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middleware
app.use(cors()); // Frontend එකට backend එක access කරන්න දෙනවා
app.use(express.json()); // JSON data කියවන්න පුළුවන් කරනවා

// Routes Mount කිරීම
// මෙතනින් තමයි ඔයාගේ API endpoints හඳුන්වලා දෙන්නේ
app.use('/api/books', bookRoutes);
// app.use('/api/auth', authRoutes); // Auth route එක හැදුවම මේක uncomment කරන්න

// Root Route (Server එක වැඩද බලන්න)
app.get('/', (req: Request, res: Response) => {
  res.send('Library Management System API is Running...');
});

// Server එක Start කිරීම
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});