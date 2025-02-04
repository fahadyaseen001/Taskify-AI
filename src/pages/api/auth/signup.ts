import { userSchema } from '@/schema/user-schema';
import PendingUser from '@/models/pendingUser';
import User from '@/models/user';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import mongoose from 'mongoose';
import allowedEmailDomains from '@/utils/mail/allowedEmailDomains.json';
import { sendVerificationEmail } from '@/utils/mail/verificationEmail';
import { configureCors } from '@/config/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS configuration
  await configureCors(req, res);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password } = req.body;

  // Validate inputs using the Zod schema
  try {
    userSchema.parse({ name, email, password });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    return res.status(500).json({ error: 'Unexpected error during validation' });
  }

  // Validate email domain
  const emailDomain = email.split('@')[1];
  if (!allowedEmailDomains.includes(emailDomain)) {
    return res
      .status(400)
      .json({ error: `Invalid email domain '${emailDomain}'. Please use a valid email provider.` });
  }

  let session: mongoose.ClientSession | null = null;

  try {
    await dbConnect();
    session = await mongoose.startSession();

    const result = await session.withTransaction(async () => {
      // Check if user already exists
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Check for existing pending user
      const existingPending = await PendingUser.findOne({ email }).session(session);
      if (existingPending) {
        // Resend verification email
        await sendVerificationEmail(email, existingPending.verificationToken);
        return {
          status: 200,
          message: 'Verification email resent. Please check your inbox.',
        };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create pending user
      const pendingUser = new PendingUser({
        name,
        email,
        password: hashedPassword,
        verificationToken,
      });

      try {
        await pendingUser.save({ session });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        return {
          status: 200,
          message: 'Please check your email to verify your account.',
        };
      } catch (err) {
        console.error("Error while saving pending user:", err);
        throw err;
      }
    });

    if (!result) {
      throw new Error('Transaction failed');
    }

    return res.status(result.status).json({ message: result.message });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Server error',
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}