// --- වෙනස් කළ තැන: 'mongoose' වලින් import කරන්න ---
import mongoose, { Document, Schema } from 'mongoose'; 

export interface IBorrow extends Document {
  user: mongoose.Schema.Types.ObjectId;
  book: mongoose.Schema.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'Borrowed' | 'Returned';
}

const BorrowSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Borrowed', 'Returned'],
    default: 'Borrowed',
  },
}, { timestamps: true });

export default mongoose.model<IBorrow>('Borrow', BorrowSchema);