// pages/api/toDo/delete.ts
import { deleteToDo } from '@/controllers/deleteController';
import authMiddleware from '@/middleware/authMiddleware';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCors } from '@/config/cors'; // Import CORS configuration

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await configureCors(req, res); // Apply CORS configuration

  await dbConnect();  // Connect to DB

  if (req.method === 'DELETE') {
    return authMiddleware(req, res, () => deleteToDo(req, res));  // Apply authentication middleware
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });  // If method is not DELETE
  }
};

export default handler;
