import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStaticHTML } from './_static';
import fs from 'fs';
import path from 'path';

/**
 * Enhanced catch-all handler with improved static file serving
 * This handles all routes not explicitly defined in other API handlers
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Extract the path from the request
  const pathSegments = request.query.path || [];
  const requestPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  
  console.log(`[Vercel] Path handler called for: ${requestPath || '/'}`);
  
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
  
  // Check if this is a request for an asset
  if (requestPath && isAssetRequest(requestPath)) {
    return serveStaticAsset(requestPath, response);
  }
  
  // For all other requests, we'll return the SPA HTML
  try {
    const html = getStaticHTML();
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return response.status(200).send(html);
  } catch (error) {
    console.error('[Vercel] Error getting static HTML:', error);
    return response.status(500).json({ 
      error: 'Failed to generate HTML', 
      timestamp: new Date().toISOString() 
    });
  }
}

/**
 * Check if the request is for a static asset
 */
function isAssetRequest(path: string): boolean {
  // Check file extensions for common asset types
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.json', '.woff', '.woff2', '.ttf', '.eot'];
  return assetExtensions.some(ext => path.endsWith(ext));
}

/**
 * Attempt to serve a static asset from various locations
 */
async function serveStaticAsset(assetPath: string, response: VercelResponse) {
  // Define potential paths where the asset might be
  const potentialPaths = [
    // Check in the public directory
    path.join(process.cwd(), 'public', assetPath),
    // Check in the regular dist output directory
    path.join(process.cwd(), 'dist', assetPath),
    // Check in the assets directory
    path.join(process.cwd(), 'assets', assetPath),
    // Check in the Vercel output directory
    path.join(process.cwd(), '.vercel', 'output', 'static', assetPath)
  ];
  
  // Try each potential path
  for (const filePath of potentialPaths) {
    try {
      if (fs.existsSync(filePath)) {
        const contentType = getContentTypeFromPath(filePath);
        response.setHeader('Content-Type', contentType);
        
        // Add caching headers for static assets
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        
        // Read and return the file
        const fileContent = fs.readFileSync(filePath);
        return response.status(200).send(fileContent);
      }
    } catch (error) {
      console.error(`[Vercel] Error checking path ${filePath}:`, error);
      // Continue to next path
    }
  }
  
  // If we get here, we couldn't find the asset
  console.log(`[Vercel] Asset not found: ${assetPath}`);
  
  // For non-found assets, we'll return the SPA HTML for client-side routing
  // This way, direct deep URLs will still load the app correctly
  try {
    const html = getStaticHTML();
    response.setHeader('Content-Type', 'text/html');
    return response.status(200).send(html);
  } catch (error) {
    console.error('[Vercel] Error getting static HTML:', error);
    return response.status(404).json({ 
      error: 'Asset not found', 
      path: assetPath,
      timestamp: new Date().toISOString() 
    });
  }
}

/**
 * Determine content type based on file extension
 */
function getContentTypeFromPath(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    case '.eot': return 'application/vnd.ms-fontobject';
    case '.txt': return 'text/plain; charset=utf-8';
    default: return 'application/octet-stream';
  }
}