import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Set CORS headers to ensure API is accessible
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  try {
    // Get deployment environment info
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'unknown';
    
    // Return API status with environment details
    return response.status(200).json({
      success: true,
      message: 'Launch.ai API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: {
        node: nodeEnv,
        vercel: vercelEnv,
        runtime: 'nodejs'
      }
    });
  } catch (error) {
    // Log the error but don't expose details in the response
    console.error('API Root Error:', error);
    
    return response.status(500).json({
      success: false,
      message: 'An error occurred while processing the request',
      timestamp: new Date().toISOString()
    });
  }
}