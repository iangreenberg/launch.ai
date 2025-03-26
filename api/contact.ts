import type { Request, Response } from 'express';

// This will work with both Express and Vercel's serverless functions
export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, company, solution, message } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !solution || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // In a real application, we would send an email or save to a database
    // For now, just return success response
    
    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({ 
      message: 'An error occurred while submitting the form' 
    });
  }
}