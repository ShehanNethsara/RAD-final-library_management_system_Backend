import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

// Admin ලට විතරක් access දෙන middleware එක
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin නම් ප්‍රශ්නයක් නෑ, ඉස්සරහට යන්න
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};