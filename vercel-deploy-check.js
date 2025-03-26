// Vercel deployment verification script
// This script checks the environment and configuration for Vercel deployment

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Launch.ai Vercel Deployment Checker');
console.log('=====================================');

// Check environment
const isVercel = process.env.VERCEL === '1';
const vercelEnv = process.env.VERCEL_ENV || 'development';
console.log(`Environment: ${isVercel ? `Vercel (${vercelEnv})` : 'Local/Dev'}`);
console.log(`Node Version: ${process.version}`);

// Track issues
const issues = [];
const warnings = [];

// Check critical files
const criticalFiles = [
  { path: 'index.html', name: 'Root index.html' },
  { path: 'client/index.html', name: 'Client index.html' },
  { path: 'vercel.json', name: 'Vercel config' },
  { path: 'api/index.ts', name: 'API root handler' },
  { path: 'api/health.ts', name: 'API health handler' },
  { path: 'api/contact.ts', name: 'API contact handler' },
  { path: 'server/routes.ts', name: 'Server routes' },
  { path: 'client/src/main.tsx', name: 'Client entry point' },
  { path: 'client/src/App.tsx', name: 'Client app component' },
  { path: 'client/src/lib/queryClient.ts', name: 'API client utility' }
];

console.log('\n📋 Checking critical files:');
for (const file of criticalFiles) {
  const filePath = path.join(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file.name} exists`);
    
    // Special checks for certain files
    if (file.path === 'index.html') {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('src="/client/src/main.tsx"')) {
        console.log(`⚠️ ${file.name} has incorrect entry point path`);
        issues.push(`${file.name} has incorrect entry point path (should be src="/src/main.tsx")`);
      }
    }
    
    if (file.path === 'vercel.json') {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Check routes order
        if (content.routes && content.routes.length > 0) {
          const firstRoute = content.routes[0];
          if (firstRoute.handle !== 'filesystem') {
            console.log(`⚠️ ${file.name} has incorrect routes order`);
            issues.push(`${file.name} has incorrect routes order (filesystem handler should be first)`);
          }
          
          // Check API routes
          const apiRoutes = content.routes.filter(r => r.src && r.src.startsWith('/api'));
          if (apiRoutes.length < 3) {
            console.log(`⚠️ ${file.name} may be missing API routes`);
            warnings.push(`${file.name} may be missing API routes for /api, /api/health, and /api/contact`);
          }
          
          // Check catch-all route
          const catchAllRoute = content.routes.find(r => r.src === '/(.*)'  || r.src === '(.*)');
          if (!catchAllRoute) {
            console.log(`⚠️ ${file.name} is missing catch-all route`);
            issues.push(`${file.name} is missing catch-all route to redirect to index.html`);
          } else if (catchAllRoute.dest !== '/index.html') {
            console.log(`⚠️ ${file.name} has incorrect catch-all route destination`);
            issues.push(`${file.name} catch-all route should redirect to /index.html`);
          }
        }
        
        // Check headers
        if (!content.headers) {
          console.log(`⚠️ ${file.name} is missing headers configuration`);
          warnings.push(`${file.name} is missing headers configuration which may cause CORS issues`);
        } else {
          const corsHeaders = content.headers.find(h => 
            h.headers && h.headers.some(header => 
              header.key && header.key.includes('Access-Control-Allow')
            )
          );
          
          if (!corsHeaders) {
            console.log(`⚠️ ${file.name} may be missing CORS headers`);
            warnings.push(`${file.name} may be missing CORS headers which could cause API access issues`);
          }
        }
      } catch (e) {
        console.log(`⚠️ ${file.name} has invalid JSON`);
        issues.push(`${file.name} has invalid JSON: ${e.message}`);
      }
    }
    
    // Check queryClient.ts for proper URL handling
    if (file.path === 'client/src/lib/queryClient.ts') {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('getFullApiUrl') && !content.includes('window.location.origin')) {
        console.log(`⚠️ ${file.name} may be missing URL handling for production deployment`);
        issues.push(`${file.name} should handle API URLs for both development and production environments`);
      }
    }
  } else {
    console.log(`❌ ${file.name} is missing`);
    issues.push(`${file.name} is missing`);
  }
}

// Check API configurations
console.log('\n📡 Checking API configurations:');
const apiDir = path.join(__dirname, 'api');
if (fs.existsSync(apiDir)) {
  console.log('✅ API directory exists');
  
  // Check each API file
  const apiFiles = ['index.ts', 'health.ts', 'contact.ts'];
  for (const file of apiFiles) {
    const filePath = path.join(apiDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ API ${file} exists`);
      
      // Check for proper imports and handling
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('@vercel/node')) {
        console.log(`⚠️ API ${file} is missing Vercel imports`);
        issues.push(`API ${file} is missing Vercel imports`);
      }
      
      if (!content.includes('Access-Control-Allow-Origin')) {
        console.log(`⚠️ API ${file} might be missing CORS headers`);
        issues.push(`API ${file} might be missing CORS headers`);
      }
      
      // Check for OPTIONS handling
      if (!content.includes('OPTIONS') && !content.includes('preflight')) {
        console.log(`⚠️ API ${file} might not handle OPTIONS/preflight requests`);
        warnings.push(`API ${file} might not properly handle OPTIONS/preflight requests`);
      }
      
      // Check for error handling
      if (!content.includes('try') && !content.includes('catch')) {
        console.log(`⚠️ API ${file} might be missing error handling`);
        warnings.push(`API ${file} might be missing proper error handling`);
      }
    } else {
      console.log(`❌ API ${file} is missing`);
      issues.push(`API ${file} is missing`);
    }
  }
} else {
  console.log('❌ API directory is missing');
  issues.push('API directory is missing');
}

// Check client components for API usage
console.log('\n🖥️ Checking client components:');
const clientDir = path.join(__dirname, 'client', 'src', 'components');
if (fs.existsSync(clientDir)) {
  console.log('✅ Client components directory exists');
  
  // Check contact form component
  const contactComponent = path.join(clientDir, 'ContactSection.tsx');
  if (fs.existsSync(contactComponent)) {
    console.log('✅ Contact form component exists');
    
    const content = fs.readFileSync(contactComponent, 'utf8');
    if (!content.includes('apiRequest') && !content.match(/fetch\s*\(\s*['"]\/api\/contact/)) {
      console.log('⚠️ Contact form component might not be using correct API client');
      warnings.push('Contact form component should use apiRequest from queryClient.ts');
    }
  } else {
    console.log('❓ Contact form component not found at expected path');
    warnings.push('Contact form component not found at expected path');
  }
} else {
  console.log('❌ Client components directory is missing');
  issues.push('Client components directory is missing');
}

// Check build output directory
console.log('\n🏗️ Checking build output:');
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  console.log('✅ dist directory exists');
  
  // Check for key files in dist
  const distFiles = ['index.html', 'assets'];
  for (const file of distFiles) {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ dist/${file} exists`);
    } else {
      console.log(`❓ dist/${file} is missing (only critical after build)`);
      if (file === 'index.html') {
        warnings.push('dist/index.html is missing - build may be incomplete');
      }
    }
  }
  
  // Check for API directory in dist (needed for Vercel serverless functions)
  const distApiDir = path.join(distDir, 'api');
  if (fs.existsSync(distApiDir)) {
    console.log('✅ dist/api directory exists');
  } else {
    console.log('❓ dist/api directory is missing (needed for Vercel serverless functions)');
    warnings.push('dist/api directory is missing - API functions may not deploy correctly');
  }
} else {
  console.log('❓ dist directory does not exist (normal before build)');
}

// Summary
console.log('\n📊 Deployment Check Summary:');
if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ No issues detected! Your project is ready for deployment.');
} else {
  if (issues.length > 0) {
    console.log(`❌ ${issues.length} critical issue(s) detected that will affect deployment:`);
    issues.forEach((issue, i) => {
      console.log(`  ${i + 1}. ${issue}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️ ${warnings.length} warning(s) detected that may affect deployment:`);
    warnings.forEach((warning, i) => {
      console.log(`  ${i + 1}. ${warning}`);
    });
  }
}

console.log('\n🔧 Troubleshooting Tips:');
console.log('1. If you see issues with API requests, check CORS headers in vercel.json and API handlers');
console.log('2. Make sure your client code uses the correct API paths that work in both dev and production');
console.log('3. For 404 errors on routes, verify that your catch-all route is correctly configured');
console.log('4. If only a portion of your site works, check for client-side routing issues');

console.log('\n🚀 Next steps:');
console.log('1. Fix any critical issues listed above');
console.log('2. Run "node vercel-build.js" to prepare for deployment');
console.log('3. Deploy with Vercel');
console.log('4. Test the deployed application thoroughly');