import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    // Gather deployment information
    const deploymentInfo = {
      success: true,
      environment: process.env.VERCEL_ENV || 'development',
      region: process.env.VERCEL_REGION || 'local',
      deploymentUrl: process.env.VERCEL_URL || 'localhost',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      apiEndpoints: [
        { path: '/api', method: 'GET', description: 'API root' },
        { path: '/api/health', method: 'GET', description: 'Health check' },
        { path: '/api/contact', method: 'POST', description: 'Contact form submission' },
        { path: '/api/config', method: 'GET', description: 'Configuration check (this endpoint)' }
      ],
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`
      }
    };

    // Return deployment information
    return response.status(200).json(deploymentInfo);
  } catch (error) {
    console.error('Error in config endpoint:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}