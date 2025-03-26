import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Get environment information
  const nodeEnv = process.env.NODE_ENV || 'development';
  const vercelEnv = process.env.VERCEL_ENV || 'unknown';
  
  // Return health status
  return response.status(200).json({
    success: true,
    status: 'healthy',
    environment: {
      node: nodeEnv,
      vercel: vercelEnv,
      runtime: 'nodejs'
    },
    timestamp: new Date().toISOString()
  });
}