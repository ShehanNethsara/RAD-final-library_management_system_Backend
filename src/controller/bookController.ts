import { Request, Response } from 'express';
import { Book } from '../model/Library';

// Admin: පොතක් ඇතුළත් කිරීම
export const addBook = async (req: Request, res: Response) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: "පොත ඇතුළත් කිරීම අසාර්ථකයි." });
    }
};

// Admin: පොතක විස්තර යාවත්කාලීන කිරීම
export const updateBook = async (req: Request, res: Response) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ error: "යාවත්කාලීන කිරීම අසාර්ථකයි." });
    }
};

// Admin: පොතක් ඉවත් කිරීම
export const deleteBook = async (req: Request, res: Response) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "පොත ඉවත් කරන ලදී." });
    } catch (error) {
        res.status(400).json({ error: "ඉවත් කිරීම අසාර්ථකයි." });
    }
};

// User: සියලුම පොත් බැලීම
export const getAllBooks = async (req: Request, res: Response) => {
    const books = await Book.find();
    res.json(books);
};