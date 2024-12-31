import { userSchema } from '@/schema/user-schema';
import User from '@/models/user';
import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import allowedEmailDomains from '@/utils/allowedEmailDomains.json'; // Adjust the path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  try {
    await dbConnect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
