import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrow extends Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'Borrowed' | 'Returned';
  fine?: number;
}

const BorrowSchema: Schema = new Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', // Book Model එකට සම්බන්ධයි
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // User Model එකට සම්බන්ධයි
    required: true 
  },
  borrowDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  returnDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['Borrowed', 'Returned'], 
    default: 'Borrowed' 
  },
  fine: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

export default mongoose.model<IBorrow>('Borrow', BorrowSchema);