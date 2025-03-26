import type { Request, Response } from 'express';

// This will work with both Express and Vercel's serverless functions
export default function handler(req: Request, res: Response) {
  res.status(200).json({
    message: 'Launch.ai API is running'
  });
}