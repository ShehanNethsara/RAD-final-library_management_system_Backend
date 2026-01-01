import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/User';

// Request එකට 'user' property එක එකතු කරන්න Interface එකක්
export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Header එකේ "Bearer <token>" විදිහට තියෙනවද බලනවා
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer" වචනය අයින් කරලා Token එක විතරක් ගන්නවා
      token = req.headers.authorization.split(' ')[1];

      // Token එක Verify කරනවා
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Token එකේ තියෙන ID එකෙන් User ව Database එකෙන් හොයාගන්නවා (Password අයින් කරලා)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // ඊළඟ function එකට යන්න
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};