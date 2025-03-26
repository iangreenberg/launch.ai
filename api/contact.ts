import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // Set CORS headers to ensure API is accessible
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false,
      message: 'Method not allowed',
      allowed: ['POST'],
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Verify request body exists
    if (!request.body) {
      return response.status(400).json({
        success: false,
        message: 'Request body is empty',
        timestamp: new Date().toISOString()
      });
    }
    
    // Extract form data
    const { firstName, lastName, email, company, solution, message } = request.body;
    
    // Validate required fields
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!email) missingFields.push('email');
    if (!solution) missingFields.push('solution');
    if (!message) missingFields.push('message');
    
    if (missingFields.length > 0) {
      return response.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        missingFields,
        timestamp: new Date().toISOString()
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
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
    return response.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log the error but don't expose details in the response
    console.error('Contact API Error:', error);
    
    return response.status(500).json({ 
      success: false,
      message: 'An error occurred while processing your submission',
      timestamp: new Date().toISOString()
    });
  }
}