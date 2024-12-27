// pages/api/toDo/read.ts
import { getAllToDos } from '@/controllers/readController';  // Import the read controller
import authMiddleware from '@/middleware/authMiddleware';  // Authentication middleware to validate token
import dbConnect from '@/utils/dbConnect';  // Database connection utility
import type { NextApiRequest, NextApiResponse } from 'next';  // Next.js types for request and response

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();  // Connect to the database

  if (req.method === 'GET') {
    // Apply authentication middleware, then call getAllToDos function if the request is GET
    return authMiddleware(req, res, () => getAllToDos(req, res));
  } else {
    // If method is not GET, return a Method Not Allowed error
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler;
