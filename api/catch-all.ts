import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStaticHTML } from './_static';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  console.log('Catch-all handler called:', request.url);
  
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }
  
  // Check if this is an API request
  if (request.url?.startsWith('/api/')) {
    // If this is an API request that we can't directly handle, return a 404
    return response.status(404).json({
      error: 'API endpoint not found',
      url: request.url,
      timestamp: new Date().toISOString()
    });
  }
  
  // For all other requests, we'll return the static HTML
  try {
    const html = getStaticHTML();
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(html);
  } catch (error) {
    console.error('Error getting static HTML:', error);
    return response.status(500).json({ 
      error: 'Failed to generate HTML', 
      timestamp: new Date().toISOString() 
    });
  }
}