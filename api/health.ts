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
    // Get environment information
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'unknown';
    
    // Collect system health information
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Return health status with detailed information
    return response.status(200).json({
      success: true,
      status: 'healthy',
      environment: {
        node: nodeEnv,
        vercel: vercelEnv,
        runtime: 'nodejs'
      },
      system: {
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB'
        },
        uptime: uptime + 's'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log the error but don't expose details in the response
    console.error('Health API Error:', error);
    
    return response.status(500).json({
      success: false,
      status: 'error',
      message: 'An error occurred while checking health status',
      timestamp: new Date().toISOString()
    });
  }
}