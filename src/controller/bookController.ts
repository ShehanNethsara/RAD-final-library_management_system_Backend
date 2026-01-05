import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Book from '../model/Book'; // ඔයාගේ Model folder එක 'models' ද 'model' ද කියලා බලන්න

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  // අලුත්ම පොත් උඩින් එන්න (createdAt: -1)
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

// @desc    Add a new book (with Image Upload)
// @route   POST /api/books
// @access  Private/Admin
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

  // 1. ISBN එක කලින් තියෙනවද බලනවා (Validation)
  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    res.status(400);
    throw new Error('Book with this ISBN already exists');
  }

  // 2. Image URL එක සකස් කරගැනීම
  let imageUrl = '';
  
  if (req.file) {
    // File එකක් Upload වුනා නම්, Server URL එක හදනවා
    imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (req.body.imageUrl) {
    // File එකක් නැතුව Link එකක් විතරක් දැම්මොත්
    imageUrl = req.body.imageUrl;
  }

  // 3. පොත Database එකේ Save කිරීම
  const book = await Book.create({
    title, 
    author, 
    isbn, 
    category, 
    totalCopies: Number(totalCopies), 
    availableCopies: Number(totalCopies), // මුලින්ම available ගාණ total ගාණමයි
    imageUrl, // හදාගත්තු Image URL එක
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

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = asyncHandler(async (req: Request, res: Response) => {
  const { 
    title, author, isbn, category, totalCopies, availableCopies, imageUrl, shelfLocation 
  } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    book.imageUrl = imageUrl || book.imageUrl; // මෙතනත් ඕන නම් File Upload logic දාන්න පුළුවන් පස්සේ
    book.shelfLocation = shelfLocation || book.shelfLocation;
    
    // --- මේ කොටස අනිවාර්යයි (Copies update වීම සඳහා) ---
    if (totalCopies !== undefined) book.totalCopies = Number(totalCopies);
    if (availableCopies !== undefined) book.availableCopies = Number(availableCopies);

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
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