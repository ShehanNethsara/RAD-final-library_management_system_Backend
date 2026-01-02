import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/User';
import generateToken from '../util/generateToken';

// Register User
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
  
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role: role || 'user'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        // වෙනස මෙතනයි: .toString() භාවිතා කිරීම හෝ double casting
        token: generateToken((user._id as unknown) as string, user.role), 
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        role: user.role,
        // වෙනස මෙතනයි:
        token: generateToken((user._id as unknown) as string, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};