import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApiContact } from '../server/routes';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  console.log('API contact handler called:', request.method);
  
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
  
  // Forward to the shared handler function
  return handleApiContact(request as any, response as any);
}