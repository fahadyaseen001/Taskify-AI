import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

const allowedOrigins = [
  'https://taskify-ai-jet.vercel.app',
  'http://localhost:3000',
  // Add any other allowed origins here
];

export async function configureCors(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    origin: (origin: string | undefined) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return true;
      }
      return false;
    },
    credentials: true,
    optionsSuccessStatus: 200,
  });
} 