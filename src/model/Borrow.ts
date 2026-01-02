import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrow extends Document {
  bookId: mongoose.Types.ObjectId | any; // Populated data ගන්න any දැම්මා
  userId: mongoose.Types.ObjectId | any;
  borrowDate: Date;
  dueDate: Date; // ආපහු දෙන දිනය
  returnDate?: Date;
  status: 'Borrowed' | 'Returned';
}

const BorrowSchema: Schema = new Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true }, // මේක අපි Controller එකෙන් set කරනවා
  returnDate: { type: Date },
  status: { type: String, enum: ['Borrowed', 'Returned'], default: 'Borrowed' }
}, { timestamps: true });

export default mongoose.model<IBorrow>('Borrow', BorrowSchema);