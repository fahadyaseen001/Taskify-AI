// pages/api/toDo/update.ts
import { updateToDo } from '@/controllers/updateController';
import authMiddleware from '@/middleware/authMiddleware';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCors } from '@/config/cors'; // Import CORS configuration

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await configureCors(req, res); // Apply CORS configuration

  await dbConnect();  // Connect to DB

  if (req.method === 'PUT') {
    return authMiddleware(req, res, () => updateToDo(req, res));  // Apply authentication middleware and update To-Do
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });  // If method is not PUT
  }
};

export default handler;
