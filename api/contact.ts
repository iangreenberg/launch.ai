import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  try {
    const { firstName, lastName, email, company, solution, message } = request.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !solution || !message) {
      return response.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }
    
    // Send success response
    console.log('Form submission successful:', { firstName, lastName, email, solution });
    
    return response.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return response.status(500).json({ 
      success: false,
      message: 'An error occurred while submitting the form' 
    });
  }
}