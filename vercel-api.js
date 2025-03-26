// Utility script to interact with the Vercel API
import fetch from 'node-fetch';
import { execSync } from 'child_process';

// Configuration
const PROJECT_ID = 'prj_BzPRilsNCG6htb1h42RApCV7wyDa';
const VERCEL_API_URL = 'https://api.vercel.com';

// Get the token from environment
const token = process.env.VERCEL_TOKEN;

async function makeVercelApiRequest(endpoint, method = 'GET', body = null) {
  const url = `${VERCEL_API_URL}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  try {
    console.log(`Making ${method} request to: ${url}`);
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      return { error: data, status: response.status };
    }
    
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    return { error: error.message };
  }
}

// Function to get project details
async function getProjectDetails() {
  return makeVercelApiRequest(`/v9/projects/${PROJECT_ID}`);
}

// Function to get deployments
async function getDeployments(limit = 5) {
  return makeVercelApiRequest(`/v6/deployments?projectId=${PROJECT_ID}&limit=${limit}`);
}

// Function to get a specific deployment
async function getDeployment(deploymentId) {
  return makeVercelApiRequest(`/v13/deployments/${deploymentId}`);
}

// Function to trigger a new deployment
async function createDeployment() {
  const payload = {
    name: 'launch-ai',
    project: PROJECT_ID,
    target: 'production',
    meta: {
      githubCommitRef: 'main'
    }
  };
  
  return makeVercelApiRequest('/v13/deployments', 'POST', payload);
}

// Function to check environmental variables
async function getEnvironmentVariables() {
  return makeVercelApiRequest(`/v9/projects/${PROJECT_ID}/env`);
}

// Main function
async function main() {
  const command = process.argv[2] || 'help';
  
  // Check if token exists
  if (!token) {
    console.error('Error: VERCEL_TOKEN not found in environment variables');
    console.log('Please set the VERCEL_TOKEN environment variable and try again');
    process.exit(1);
  }
  
  switch (command) {
    case 'project':
      console.log(await getProjectDetails());
      break;
    case 'deployments':
      console.log(await getDeployments());
      break;
    case 'deployment':
      const deploymentId = process.argv[3];
      if (!deploymentId) {
        console.error('Error: No deployment ID provided');
        console.log('Usage: node vercel-api.js deployment <deployment-id>');
        process.exit(1);
      }
      console.log(await getDeployment(deploymentId));
      break;
    case 'deploy':
      console.log(await createDeployment());
      break;
    case 'env':
      console.log(await getEnvironmentVariables());
      break;
    case 'latest':
      const deployments = await getDeployments(1);
      if (deployments.deployments && deployments.deployments.length > 0) {
        console.log(await getDeployment(deployments.deployments[0].uid));
      } else {
        console.log('No deployments found');
      }
      break;
    default:
      console.log(`
Vercel API Utility Script

Available commands:
  project       - Get project details
  deployments   - List recent deployments
  deployment <id> - Get details of a specific deployment
  deploy        - Trigger a new deployment
  env           - List environment variables
  latest        - Get latest deployment details
      `);
  }
}

// Execute if run directly
if (process.argv[1].endsWith('vercel-api.js')) {
  main().catch(console.error);
}

export {
  getProjectDetails,
  getDeployments,
  getDeployment,
  createDeployment,
  getEnvironmentVariables
};