// Utilities to help fix Vercel deployment issues for Launch.ai
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_NAME = 'launch-ai';
const SITE_URL = 'https://launch-ai-ruby.vercel.app';

// Function to check if the site is properly deployed
async function checkDeployment() {
  try {
    console.log(`Checking deployment at ${SITE_URL}...`);
    const response = await fetch(SITE_URL);
    
    if (!response.ok) {
      console.error(`Site returned status code: ${response.status}`);
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);
    
    const content = await response.text();
    
    // Check if the response is HTML
    if (contentType && contentType.includes('text/html')) {
      console.log('Site is returning HTML as expected');
      console.log(`First 200 characters of content: ${content.substring(0, 200)}...`);
      return true;
    } else {
      console.error('Site is not returning HTML content');
      console.log(`First 200 characters of content: ${content.substring(0, 200)}...`);
      return false;
    }
  } catch (error) {
    console.error('Error checking deployment:', error);
    return false;
  }
}

// Function to check basic API endpoints
async function checkApiEndpoints() {
  const endpoints = [
    '/api',
    '/api/health',
    '/api/config',
    '/api/contact'
  ];
  
  const results = {};
  
  for (const endpoint of endpoints) {
    const url = `${SITE_URL}${endpoint}`;
    try {
      console.log(`Checking API endpoint: ${url}`);
      const response = await fetch(url);
      
      results[endpoint] = {
        status: response.status,
        contentType: response.headers.get('content-type')
      };
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        results[endpoint].data = await response.json();
      } else {
        results[endpoint].text = await response.text();
      }
      
    } catch (error) {
      console.error(`Error checking ${endpoint}:`, error);
      results[endpoint] = { error: error.message };
    }
  }
  
  return results;
}

// Function to verify key files exist in the project
function checkDeploymentFiles() {
  const requiredFiles = [
    'vercel.json',
    'vercel-build.js',
    'api/index.ts',
    'api/health.ts',
    'api/config.ts',
    'api/contact.ts',
    'api/_static.js',
    'vercel.html'
  ];
  
  const results = {};
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    results[file] = fs.existsSync(filePath);
  }
  
  return results;
}

// Function to suggest fixes based on diagnostic results
function suggestFixes(deploymentOk, apiResults, fileResults) {
  const suggestions = [];
  
  if (!deploymentOk) {
    suggestions.push('- Main site is not returning proper HTML. Check vercel.json configuration.');
    suggestions.push('- Ensure vercel-build.js is correctly processing and copying HTML files.');
    suggestions.push('- Verify that the "builds" and "routes" sections in vercel.json are properly configured.');
  }
  
  for (const [endpoint, result] of Object.entries(apiResults)) {
    if (result.error || result.status >= 400) {
      suggestions.push(`- API endpoint ${endpoint} is not working properly. Check the corresponding file.`);
    }
  }
  
  for (const [file, exists] of Object.entries(fileResults)) {
    if (!exists) {
      suggestions.push(`- Required file ${file} is missing. Create it before deployment.`);
    }
  }
  
  if (suggestions.length === 0) {
    suggestions.push('- All checks passed. If deployment is still failing, check Vercel logs for specific errors.');
  }
  
  return suggestions;
}

// Main diagnostic function
async function runDiagnostic() {
  console.log('=== Launch.ai Vercel Deployment Diagnostic ===');
  
  // Check deployment
  const deploymentOk = await checkDeployment();
  
  // Check API endpoints
  console.log('\n--- API Endpoint Check ---');
  const apiResults = await checkApiEndpoints();
  
  // Check required files
  console.log('\n--- Deployment Files Check ---');
  const fileResults = checkDeploymentFiles();
  console.log(fileResults);
  
  // Generate suggestions
  console.log('\n--- Suggestions ---');
  const suggestions = suggestFixes(deploymentOk, apiResults, fileResults);
  suggestions.forEach(suggestion => console.log(suggestion));
  
  console.log('\n=== Diagnostic Complete ===');
}

// Export functions
export {
  checkDeployment,
  checkApiEndpoints,
  checkDeploymentFiles,
  suggestFixes,
  runDiagnostic
};

// Run diagnostic if called directly
if (process.argv[1].endsWith('vercel-deploy-utils.js')) {
  runDiagnostic().catch(console.error);
}