import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateToken = (id: string | mongoose.Types.ObjectId, role: string) => {
  // .env එකේ JWT_SECRET කියල එකක් දාන්න ඕන
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // දවස් 30කින් expire වෙනවා
  });
};

export default generateToken;