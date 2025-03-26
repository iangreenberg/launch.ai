// This file contains pre-build and post-build operations for Vercel deployment
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process for Vercel deployment...');

// Check if we're in a Vercel environment
const isVercel = process.env.VERCEL === '1';
console.log(`🔍 Build environment: ${isVercel ? 'Vercel' : 'Local'}`);

// Ensure the /api directory is properly configured
const apiDir = path.join(process.cwd(), 'api');
if (fs.existsSync(apiDir)) {
  console.log('✅ API directory found, checking serverless functions...');
  
  // List files in the API directory
  const apiFiles = fs.readdirSync(apiDir);
  console.log(`📄 API files found: ${apiFiles.join(', ')}`);
  
  // Check if we have all required API files
  const requiredApiFiles = ['index.ts', 'health.ts', 'contact.ts'];
  const missingFiles = requiredApiFiles.filter(file => !apiFiles.includes(file));
  
  if (missingFiles.length > 0) {
    console.warn(`⚠️ Missing API files: ${missingFiles.join(', ')}`);
  } else {
    console.log('✅ All required API files found');
  }
} else {
  console.warn('⚠️ API directory not found, creating it...');
  fs.mkdirSync(apiDir);
  console.log('✅ API directory created');
}

// Check if vercel.json exists
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  console.log('✅ vercel.json found');
  
  try {
    // Parse vercel.json to check for issues
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    console.log(`📄 Vercel config contains: ${Object.keys(vercelConfig).join(', ')}`);
    
    // Check for required configurations
    const requiredConfigs = ['version', 'routes'];
    const missingConfigs = requiredConfigs.filter(config => !vercelConfig[config]);
    
    if (missingConfigs.length > 0) {
      console.warn(`⚠️ Missing required configurations in vercel.json: ${missingConfigs.join(', ')}`);
    } else {
      console.log('✅ All required configurations found in vercel.json');
    }
  } catch (error) {
    console.error('❌ Error parsing vercel.json:', error.message);
  }
} else {
  console.warn('⚠️ vercel.json not found');
}

// Ensure package.json has correct build command
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log(`✅ Build command found: ${packageJson.scripts.build}`);
    } else {
      console.warn('⚠️ No build command found in package.json');
    }
  } catch (error) {
    console.error('❌ Error parsing package.json:', error.message);
  }
}

console.log('✅ Build process preparation complete');
console.log('🔨 Production build will now begin...');

// The rest of the build process is handled by Vercel's build command