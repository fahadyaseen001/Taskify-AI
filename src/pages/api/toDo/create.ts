// pages/api/toDo/create.ts
import { createToDo } from '@/controllers/createController';
import authMiddleware from '@/middleware/authMiddleware';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCors } from '@/config/cors'; // Import CORS configuration

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await configureCors(req, res); // Apply CORS configuration

  await dbConnect();  // Connect to DB

  if (req.method === 'POST') {
    return authMiddleware(req, res, () => createToDo(req, res));  // Apply authentication middleware
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });  // If method is not POST
  }
};

export default handler;
