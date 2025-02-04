import User from '@/models/user';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import { configureCors } from '@/config/cors'; // Import CORS configuration

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await configureCors(req, res); // Apply CORS configuration

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    
    const users = await User.find({}, 'name email'); 

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
