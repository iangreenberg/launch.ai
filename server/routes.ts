import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API root endpoint for health checks
  app.get("/api", (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Launch.ai API is running",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    });
  });
  
  // API health endpoint for detailed status
  app.get("/api/health", (req, res) => {
    // Get environment information
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'unknown';
    
    // Return health status
    return res.status(200).json({
      success: true,
      status: 'healthy',
      environment: {
        node: nodeEnv,
        vercel: vercelEnv,
        runtime: 'nodejs'
      },
      timestamp: new Date().toISOString()
    });
  });

  // API route for contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, company, solution, message } = req.body;
      
      // Validate required fields
      if (!firstName || !lastName || !email || !solution || !message) {
        return res.status(400).json({ 
          success: false,
          message: "Missing required fields" 
        });
      }
      
      // In a real application, we would save this to a database
      // For now, just return success response
      console.log("Form submission received:", { firstName, lastName, email, solution });
      
      return res.status(200).json({ 
        success: true, 
        message: "Contact form submitted successfully" 
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return res.status(500).json({ 
        success: false,
        message: "An error occurred while submitting the form" 
      });
    }
  });

  // Handle preflight OPTIONS requests for CORS
  app.options("/api/*", (req, res) => {
    res.status(200).end();
  });

  const httpServer = createServer(app);

  return httpServer;
}
