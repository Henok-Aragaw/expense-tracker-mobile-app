import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Unauthorized' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    if (!config.JWT_SECRET) throw new Error('JWT_SECRET not defined');

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user.id, name: user.name, email: user.email }; // safer typing
    next();
  } catch (err) {
    next(err);
  }
};
