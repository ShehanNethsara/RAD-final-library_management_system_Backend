// src/models/User.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // කලින් තිබුනේ මේක විතරයි
  isAdmin: { type: Boolean, required: true, default: false },

  // අලුතින් මේක එකතු කරන්න (ඔයාගේ data වල role field එකක් තියෙන නිසා)
  role: { type: String, default: 'user' }, 

}, { timestamps: true });

// ... (ඉතුරු කෝඩ් එහෙම්ම තියන්න)

const User = mongoose.model('User', userSchema);
export default User;