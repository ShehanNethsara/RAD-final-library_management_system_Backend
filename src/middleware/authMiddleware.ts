import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../model/User';

// 1. මෙතන තමයි අපි අලුත් Interface එක හදන්නේ
// මේකෙන් අපි කියනවා Request එක ඇතුලේ 'user' කියලා කෑල්ලක් තියෙනවා කියලා.
export interface AuthRequest extends Request {
  user?: any; 
}

interface DecodedToken {
  id: string;
}

const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin Middleware
// src/middleware/authMiddleware.ts

const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Debug කරන්න මේ console log එක උදව් වෙයි
  console.log("User Info in Backend:", req.user);

  // දැන් අපි check කරනවා 'isAdmin' field එක හෝ 'role' field එක
  if (req.user && (req.user.isAdmin === true || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
export { protect, adminOnly };