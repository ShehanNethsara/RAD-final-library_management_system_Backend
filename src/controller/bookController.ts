import { Request, Response } from 'express';
import Book from '../model/Book';
import { AuthRequest } from '../middleware/authMiddleware';

// Get Books (Public)
// Search ෆිල්ටර් එකක් දාලා තියෙන්නේ, පස්සේ ඕන වෙයි.
export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 }); // අලුත්ම පොත් උඩින් එන්න
  res.json(books);
};

// Add Book (Admin Only) - Updated with new features
export const createBook = async (req: AuthRequest, res: Response) => {
  const { 
    title, 
    author, 
    isbn, 
    category, 
    totalCopies, 
    // අලුත් දත්ත ටික මෙතනට ගන්නවා
    imageUrl, 
    description, 
    publisher, 
    publishedYear, 
    language, 
    shelfLocation 
  } = req.body;

  // ISBN එක කලින් තියෙනවද බලනවා (Validation)
  const bookExists = await Book.findOne({ isbn });
  if (bookExists) {
    return res.status(400).json({ message: 'Book with this ISBN already exists' });
  }

  const book = await Book.create({
    title, 
    author, 
    isbn, 
    category, 
    totalCopies, 
    availableCopies: totalCopies, // මුලින්ම available ගාණ total ගාණමයි
    
    // අලුත් දත්ත ටික save කරනවා
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
    res.status(400).json({ message: 'Invalid book data' });
  }
};

// Update Book (Admin Only) - Updated
export const updateBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.isbn = req.body.isbn || book.isbn;
    book.category = req.body.category || book.category;
    book.totalCopies = req.body.totalCopies || book.totalCopies;
    
    // අලුත් දත්ත ටික Update කරනවා
    book.imageUrl = req.body.imageUrl || book.imageUrl;
    book.description = req.body.description || book.description;
    book.publisher = req.body.publisher || book.publisher;
    book.publishedYear = req.body.publishedYear || book.publishedYear;
    book.language = req.body.language || book.language;
    book.shelfLocation = req.body.shelfLocation || book.shelfLocation;

    // Total copies වෙනස් වුනොත් available ගාණත් හදන්න ඕන Logic එකක් පස්සේ දාන්න පුළුවන්.
    // දැනට අපි කෙලින්ම save කරමු.
    
    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
};

// Delete Book (Admin Only)
export const deleteBook = async (req: Request, res: Response) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book removed' });
};