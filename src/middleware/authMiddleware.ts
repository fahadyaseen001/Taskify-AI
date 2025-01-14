'use server'


import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

declare module 'next' {
  interface NextApiRequest {
    userId?: string;
    userName?: string;
    userEmail?: string;
  }
}

const authMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    req.userName = decoded.name;
    req.userEmail = decoded.email;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
