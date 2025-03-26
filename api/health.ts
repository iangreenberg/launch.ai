import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApiHealth } from '../server/routes';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Forward to the shared handler function
  return handleApiHealth(request as any, response as any);
}