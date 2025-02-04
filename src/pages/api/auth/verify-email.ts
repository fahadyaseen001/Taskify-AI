import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import PendingUser from '@/models/pendingUser';
import User from '@/models/user';
import mongoose from 'mongoose';
import { configureCors } from '@/config/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await configureCors(req, res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid verification token' });
  }

  try {
    await dbConnect();
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        const pendingUser = await PendingUser.findOne({ 
          verificationToken: token 
        }).session(session);

        if (!pendingUser) {
          throw new Error('Invalid or expired verification token');
        }

        const existingUser = await User.findOne({ 
          email: pendingUser.email 
        }).session(session);

        if (existingUser) {
          await PendingUser.deleteOne({ 
            _id: pendingUser._id 
          }).session(session);
          throw new Error('User already exists');
        }

        const user = new User({
          name: pendingUser.name,
          email: pendingUser.email,
          password: pendingUser.password,
        });
        await user.save({ session });

        await PendingUser.deleteOne({ 
          _id: pendingUser._id 
        }).session(session);
      });

      // Redirect with simple success flag
      res.redirect(302, '/auth?verified=true');
      return;

    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error('Verification error:', error);
    // Redirect with simple error flag
    res.redirect(302, '/auth?verified=false');
    return;
  }
}