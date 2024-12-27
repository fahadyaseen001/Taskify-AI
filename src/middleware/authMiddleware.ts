import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

declare module 'next' {
  interface NextApiRequest {
    userId?: string;  
  }}



const authMiddleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;  

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userId = decoded.userId;  // Safe to access userId now
    return next();  // Call the next function (createToDo)
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;
