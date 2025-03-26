import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Helper function to set CORS headers to ensure API is accessible
function setCorsHeaders(res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
}

// API root endpoint handler
export function handleApiRoot(req: Request, res: Response) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Get deployment environment info
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'unknown';
    
    // Return API status with environment details
    return res.status(200).json({
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
    console.error('API Root Error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing the request',
      timestamp: new Date().toISOString()
    });
  }
}

// API health endpoint handler
export function handleApiHealth(req: Request, res: Response) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Get environment information
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'unknown';
    
    // Collect system health information
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    // Return health status with detailed information
    return res.status(200).json({
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
    console.error('Health API Error:', error);
    
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'An error occurred while checking health status',
      timestamp: new Date().toISOString()
    });
  }
}

// API contact endpoint handler
export function handleApiContact(req: Request, res: Response) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      allowed: ['POST'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Verify request body exists
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is empty',
        timestamp: new Date().toISOString()
      });
    }
    
    // Extract form data
    const { firstName, lastName, email, company, solution, message } = req.body;
    
    // Validate required fields
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!solution) missingFields.push('solution');
    if (!message) missingFields.push('message');
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        missingFields,
        timestamp: new Date().toISOString()
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        timestamp: new Date().toISOString()
      });
    }
    
    // Here we would normally store the contact submission in a database
    // For now, just log it and return success
    console.log('Form submission received:', {
      firstName,
      lastName,
      email,
      company: company || 'Not provided',
      solution,
      messageLength: message.length
    });
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your submission',
      timestamp: new Date().toISOString()
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Map API handlers to routes
  app.get("/api", handleApiRoot);
  app.get("/api/health", handleApiHealth);
  app.post("/api/contact", handleApiContact);
  
  // Handle preflight OPTIONS requests for CORS
  app.options("/api/*", (req, res) => {
    setCorsHeaders(res);
    res.status(200).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
