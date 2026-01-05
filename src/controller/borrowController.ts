import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Borrow from '../model/Borrow';
import Book from '../model/Book';


export const borrowBook = asyncHandler(async (req: any, res: Response) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (book.availableCopies < 1) {
    res.status(400);
    throw new Error('Book is out of stock');
  }

  const existingBorrow = await Borrow.findOne({ user: userId, book: bookId, status: 'Borrowed' });
  if (existingBorrow) {
    res.status(400);
    throw new Error('You have already borrowed this book');
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const borrow = await Borrow.create({
    user: userId,
    book: bookId,
    dueDate: dueDate,
    status: 'Borrowed'
  });

  book.availableCopies = book.availableCopies - 1;
  await book.save();

  res.status(201).json(borrow);
});


export const getMyBorrows = asyncHandler(async (req: any, res: Response) => {
  const borrows = await Borrow.find({ user: req.user._id })
    .populate('book', 'title author imageUrl')
    .sort({ createdAt: -1 });
    
  res.json(borrows);
});

export const returnBook = asyncHandler(async (req: any, res: Response) => {
  const { borrowId } = req.params;

  const borrow = await Borrow.findById(borrowId);

  if (!borrow) {
    res.status(404);
    throw new Error('Borrow record not found');
  }

  if (borrow.status === 'Returned') {
    res.status(400);
    throw new Error('Book already returned');
  }

  borrow.status = 'Returned';
  borrow.returnDate = new Date();
  await borrow.save();

  const book = await Book.findById(borrow.book);
  if (book) {
    book.availableCopies = book.availableCopies + 1;
    await book.save();
  }

  res.json({ message: 'Book returned successfully' });
});

export const getAllBorrows = asyncHandler(async (req: any, res: Response) => {
  const borrows = await Borrow.find({})
    .populate('user', 'name email') 
    .populate('book', 'title author imageUrl') 
    .sort({ createdAt: -1 });
    
  res.json(borrows);
});