import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member'; // Role එක වර්ග දෙකයි
}

const UserSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Email එක duplicate වෙන්න බෑ
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'member'], 
    default: 'member' // Register වෙන කොට auto 'member' වෙනවා
  },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);