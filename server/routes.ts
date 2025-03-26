import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, company, solution, message } = req.body;
      
      // Validate required fields
      if (!firstName || !lastName || !email || !solution || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // In a real application, we would save this to a database
      // For now, just return success response
      
      return res.status(200).json({ 
        success: true, 
        message: "Contact form submitted successfully" 
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return res.status(500).json({ 
        message: "An error occurred while submitting the form" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
