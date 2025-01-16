import { AIAgentService } from '@/services/aiAgent';
import authMiddleware from '@/middleware/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'POST') {
    return authMiddleware(req, res, async () => {
      try {
        const { command } = req.body;
        
        if (!command) {
          return res.status(400).json({ message: 'Command is required' });
        }

        const result = await AIAgentService.processCommand(
          command,
          req.userId!,
          req.userName!,
          req.userEmail!
        );

        return res.status(200).json(result);
      } catch (error) {
        console.error('AI Command Processing Error:', error);
        return res.status(500).json({ message: 'Error processing AI command' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default handler; 