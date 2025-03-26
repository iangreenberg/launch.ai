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
console.log(`Environment: ${isVercel ? 'Vercel' : 'Local/Dev'}`);
console.log(`Node Version: ${process.version}`);

// Track issues
const issues = [];

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
  { path: 'client/src/App.tsx', name: 'Client app component' }
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
        }
      } catch (e) {
        console.log(`⚠️ ${file.name} has invalid JSON`);
        issues.push(`${file.name} has invalid JSON: ${e.message}`);
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
      
      if (!content.includes('setCorsHeaders') && !content.includes('Access-Control-Allow-Origin')) {
        console.log(`⚠️ API ${file} might be missing CORS headers`);
        issues.push(`API ${file} might be missing CORS headers`);
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
    }
  }
} else {
  console.log('❓ dist directory does not exist (normal before build)');
}

// Summary
console.log('\n📊 Deployment Check Summary:');
if (issues.length === 0) {
  console.log('✅ No issues detected! Your project is ready for deployment.');
} else {
  console.log(`⚠️ ${issues.length} issue(s) detected that may affect deployment:`);
  issues.forEach((issue, i) => {
    console.log(`  ${i + 1}. ${issue}`);
  });
}

console.log('\n🚀 Next steps:');
console.log('1. Run "node vercel-build.js" to prepare for deployment');
console.log('2. Deploy with Vercel or your preferred platform');
console.log('3. Test the deployed application thoroughly');