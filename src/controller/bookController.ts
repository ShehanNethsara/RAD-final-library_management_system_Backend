// controllers/bookController.ts
import { Request, Response } from 'express';
import Book, { IBook } from '../model/Book';

// @desc    Get all books
// @route   GET /api/books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.status(200).json(books); // [cite: 81] Status codes වැදගත්
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
export const addBook = async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, category, availableCopies } = req.body;

    // Validation (සරලව)
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const newBook: IBook = new Book({
      title,
      author,
      isbn,
      category,
      availableCopies
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};