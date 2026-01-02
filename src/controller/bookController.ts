import { Request, Response } from 'express';
import Book from '../model/Book';

// Get Books (Public)
export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find();
  res.json(books);
};

// Add Book (Admin Only)
export const createBook = async (req: Request, res: Response) => {
  const { title, author, isbn, category, totalCopies } = req.body;
  const book = await Book.create({
    title, author, isbn, category, 
    totalCopies, availableCopies: totalCopies
  });
  res.status(201).json(book);
};

// Update Book (Admin Only)
export const updateBook = async (req: Request, res: Response) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

// Delete Book (Admin Only)
export const deleteBook = async (req: Request, res: Response) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book removed' });
};