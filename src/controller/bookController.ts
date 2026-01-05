import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Book from '../model/Book';


export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});


export const createBook = asyncHandler(async (req: any, res: Response) => {
  const { 
    title, 
    author, 
    isbn, 
    category, 
    totalCopies, 
    description, 
    publisher, 
    publishedYear, 
    language, 
    shelfLocation 
  } = req.body;

  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    res.status(400);
    throw new Error('Book with this ISBN already exists');
  }

  let imageUrl = '';
  
  if (req.file) {
    imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    imageUrl = req.body.imageUrl;
  }

  // book db sv krnwa
  const book = await Book.create({
    title, 
    author, 
    isbn, 
    category, 
    totalCopies: Number(totalCopies), 
    availableCopies: Number(totalCopies), 
    imageUrl, 
    description, 
    publisher, 
    publishedYear, 
    language, 
    shelfLocation
  });

  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Invalid book data');
  }
});


export const updateBook = asyncHandler(async (req: any, res: Response) => {
  const { 
    title, author, isbn, category, totalCopies, availableCopies, shelfLocation 
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.shelfLocation = shelfLocation || book.shelfLocation;
    
    // Image Update  
    if (req.file) {
      book.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    
    if (totalCopies !== undefined) book.totalCopies = Number(totalCopies);
    if (availableCopies !== undefined) book.availableCopies = Number(availableCopies);

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});


export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});