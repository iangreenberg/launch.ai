import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  return response.status(200).json({
    success: true,
    message: 'Launch.ai API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}