import { Request, Response, NextFunction } from 'express';

// නිකන්ම එන 404 Errors අල්ලගන්න (Route not found)
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// සිස්ටම් එකේ එන ඕනෑම Error එකක් JSON විදිහට යවන්න
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    // Production එකේදී Stack trace එක යවන්නේ නෑ (Security වලට)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};