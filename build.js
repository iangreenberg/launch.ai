// This file contains pre-build and post-build operations for Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    
    // Verify API files are using shared handlers
    let allUsingSharedHandlers = true;
    for (const file of requiredApiFiles) {
      const filePath = path.join(apiDir, file);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        if (!fileContent.includes('import { handle') || !fileContent.includes('from \'../server/routes\'')) {
          console.warn(`⚠️ API file ${file} is not using shared handlers`);
          allUsingSharedHandlers = false;
        }
      }
    }
    
    if (allUsingSharedHandlers) {
      console.log('✅ All API files are using shared handlers');
    }
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
    const requiredConfigs = ['version', 'routes', 'headers'];
    const missingConfigs = requiredConfigs.filter(config => !vercelConfig[config]);
    
    if (missingConfigs.length > 0) {
      console.warn(`⚠️ Missing required configurations in vercel.json: ${missingConfigs.join(', ')}`);
    } else {
      console.log('✅ All required configurations found in vercel.json');
      
      // Validate routes configuration
      if (vercelConfig.routes) {
        // Check if we have the filesystem handler first (important for Vercel)
        const hasFilesystemFirst = vercelConfig.routes[0] && 
                                  vercelConfig.routes[0].handle === 'filesystem';
        
        if (!hasFilesystemFirst) {
          console.warn('⚠️ First route should be { "handle": "filesystem" } for proper asset handling');
        } else {
          console.log('✅ Filesystem handler is first in routes');
        }
        
        // Check if we have all required API routes
        const requiredRoutes = ['/api', '/api/health', '/api/contact'];
        const missingRoutes = requiredRoutes.filter(route => 
          !vercelConfig.routes.some(r => r.src === route));
        
        if (missingRoutes.length > 0) {
          console.warn(`⚠️ Missing required routes in vercel.json: ${missingRoutes.join(', ')}`);
        } else {
          console.log('✅ All required API routes found');
        }
        
        // Check for fallback route to index.html
        const hasFallbackRoute = vercelConfig.routes.some(r => 
          r.src === '/(.*)'  && r.dest === '/index.html');
        
        if (!hasFallbackRoute) {
          console.warn('⚠️ Missing fallback route to index.html for SPA');
        } else {
          console.log('✅ Fallback route to index.html found');
        }
      }
      
      // Validate headers configuration
      if (vercelConfig.headers) {
        // Check if CORS headers are set for all routes
        const hasGlobalCors = vercelConfig.headers.some(h => 
          h.source === '/(.*)'  && 
          h.headers.some(header => header.key === 'Access-Control-Allow-Origin'));
        
        if (!hasGlobalCors) {
          console.warn('⚠️ CORS headers not found for global routes');
        } else {
          console.log('✅ CORS headers found for global routes');
        }
      }
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
    
    // Check if node version is specified
    if (packageJson.engines && packageJson.engines.node) {
      console.log(`✅ Node version specified: ${packageJson.engines.node}`);
    } else {
      console.log('⚠️ No Node version specified in package.json engines');
      
      // Add engines section if not exists
      if (!packageJson.engines) {
        packageJson.engines = { node: '>=18.x' };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Added Node.js engine requirement to package.json');
      }
    }
  } catch (error) {
    console.error('❌ Error parsing package.json:', error.message);
  }
}

// Check server/routes.ts for shared handlers
const serverRoutesPath = path.join(process.cwd(), 'server', 'routes.ts');
if (fs.existsSync(serverRoutesPath)) {
  const routesContent = fs.readFileSync(serverRoutesPath, 'utf8');
  
  // Check for exported handler functions
  const hasExportedHandlers = 
    routesContent.includes('export function handleApiRoot') && 
    routesContent.includes('export function handleApiHealth') &&
    routesContent.includes('export function handleApiContact');
  
  if (hasExportedHandlers) {
    console.log('✅ Server routes file has exported handler functions');
  } else {
    console.warn('⚠️ Server routes file missing exported handler functions');
  }
}

console.log('✅ Build process preparation complete');
console.log('🔨 Production build will now begin...');

// The rest of the build process is handled by Vercel's build command