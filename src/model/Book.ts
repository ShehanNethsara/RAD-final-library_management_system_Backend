import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
}

const BookSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  isbn: { 
    type: String, 
    required: true, 
    unique: true // එකම ISBN එකෙන් පොත් දෙකක් තියෙන්න බෑ
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  totalCopies: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  availableCopies: { 
    type: Number, 
    required: true, 
    default: 1 
  },
}, {
  timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema);