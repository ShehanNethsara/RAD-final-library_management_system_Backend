import { Request, Response } from 'express';
import Book, { IBook } from '../model/Book';

// @desc    Get all books
// @route   GET /api/books
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Create a book (Admin only)
// @route   POST /api/books
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;
    
    // availableCopies මුලින් totalCopies වලට සමානයි
    const book = new Book({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies 
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.category = req.body.category || book.category;
      // තවත් field වෙනස් කරන්න ඕන නම් මෙතනට දාන්න
      
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await book.deleteOne();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};