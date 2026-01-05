import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  imageUrl?: string;      
  description?: string;   
  publisher?: string;     
  publishedYear?: number; 
  language?: string;      
  shelfLocation?: string; 
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  
  imageUrl: { type: String, default: '' }, 
  description: { type: String, default: '' },
  publisher: { type: String, default: '' },
  publishedYear: { type: Number },
  language: { type: String, default: 'English' },
  shelfLocation: { type: String, default: 'General' }, 

}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);