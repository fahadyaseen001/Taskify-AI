import { AIAgentService } from '@/services/aiAgent';
import authMiddleware from '@/middleware/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  await dbConnect();

  if (req.method === 'POST') {
    return authMiddleware(req, res, async () => {
      try {
        const { command } = req.body;
        
        if (!command) {
          return res.status(400).json({ message: 'Command is required' });
        }

        // Call the AIAgentService with the command and user info
        const result = await AIAgentService.processCommand(
          command,
          new ObjectId(req.userId!),
          req.userName!,
          req.userEmail!
        );

        // Return the result directly as it now matches our expected response format
        return res.status(200).json(result);
      } catch (error: any) {
        console.error('AI Command Processing Error:', error);
        return res.status(500).json({ 
          success: false, 
          message: error.message || 'Error processing AI command' 
        });
      }
    });
  } else {
    res.status(405).json({ 
      success: false, 
      message: 'Method Not Allowed' 
    });
  }
};

export default handler;