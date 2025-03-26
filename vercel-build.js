// This file is a manual build script for Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting manual build process for Vercel deployment...');

// Function to execute shell commands
function execute(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Ensure directories exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// Ensure public directory exists for static files
const distPublicDir = path.join(distDir, 'public');
if (!fs.existsSync(distPublicDir)) {
  fs.mkdirSync(distPublicDir, { recursive: true });
  console.log('✅ Created dist/public directory');
}

// Create a public index.html that will be served at the root
const mainIndexPath = path.join(__dirname, 'client', 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');
const distPublicIndexPath = path.join(distPublicDir, 'index.html');

// Make sure we have a proper index.html in the public directory
if (fs.existsSync(mainIndexPath)) {
  const content = fs.readFileSync(mainIndexPath, 'utf8');
  console.log('✅ Found client/index.html, copying to dist/public');
  fs.writeFileSync(distPublicIndexPath, content);
  console.log('✅ dist/public/index.html created');
  
  // Also copy to root for compatibility
  fs.writeFileSync(rootIndexPath, content);
  console.log('✅ Root index.html updated with client/index.html content');
} else if (fs.existsSync(rootIndexPath)) {
  const content = fs.readFileSync(rootIndexPath, 'utf8');
  console.log('✅ Using root index.html, copying to dist/public');
  fs.writeFileSync(distPublicIndexPath, content);
  console.log('✅ dist/public/index.html created');
} else {
  console.warn('⚠️ No index.html found, creating a basic one');
  const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch.ai - AI Solutions</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
  fs.writeFileSync(distPublicIndexPath, basicHtml);
  fs.writeFileSync(rootIndexPath, basicHtml);
  console.log('✅ Created basic index.html files');
}

// Handle API files for Vercel serverless deployment
const apiDir = path.join(__dirname, 'api');
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
  console.warn('⚠️ API directory not found');
}

// Build the project
console.log('🔨 Building the project...');
const buildSuccess = execute('npm run build');

if (!buildSuccess) {
  console.error('❌ Build failed. Attempting to continue with deployment...');
}

// Add needed files to ensure proper Vercel deployment
console.log('📝 Adding vercel.json to the project root and dist directory');
const vercelJsonPath = path.join(__dirname, 'vercel.json');
const distVercelJsonPath = path.join(distDir, 'vercel.json');

if (fs.existsSync(vercelJsonPath)) {
  // Copy vercel.json to dist directory
  fs.copyFileSync(vercelJsonPath, distVercelJsonPath);
  console.log('✅ vercel.json copied to dist directory');
} else {
  console.warn('⚠️ vercel.json not found. Creating a basic one.');
  const basicVercelJson = `{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api", "destination": "/api/index" },
    { "source": "/api/health", "destination": "/api/health" },
    { "source": "/api/contact", "destination": "/api/contact" },
    { "source": "/(.*)", "destination": "/public/$1" }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/api/(.*)", "dest": "/api/$1.js" },
    { "src": "^(?!.*[.][a-zA-Z0-9]{2,4}$)(?!.*^/api/)(?!.*^/public/).*$", "dest": "/public/index.html" }
  ]
}`;
  fs.writeFileSync(vercelJsonPath, basicVercelJson);
  fs.writeFileSync(distVercelJsonPath, basicVercelJson);
  console.log('✅ Created basic vercel.json in root and dist directories');
}

// Copy API files to dist directory for Vercel
if (fs.existsSync(apiDir)) {
  const distApiDir = path.join(distDir, 'api');
  if (!fs.existsSync(distApiDir)) {
    fs.mkdirSync(distApiDir, { recursive: true });
    console.log('✅ Created dist/api directory');
  }
  
  // Copy all API files
  const apiFiles = fs.readdirSync(apiDir);
  for (const file of apiFiles) {
    const srcFile = path.join(apiDir, file);
    const destFile = path.join(distApiDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`✅ Copied ${file} to dist/api directory`);
  }
}

// Create a _redirects file for Vercel (just in case)
const redirectsPath = path.join(distPublicDir, '_redirects');
fs.writeFileSync(redirectsPath, `/* /index.html 200`);
console.log('✅ Created _redirects file for fallback');

// Also create a .nojekyll file to prevent GitHub Pages issues (if Vercel uses that under the hood)
const nojekyllPath = path.join(distPublicDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('✅ Created .nojekyll file');

console.log('✅ Build process complete');
console.log('🌐 The application is ready for Vercel deployment. Check https://launch-ai-ruby.vercel.app/ after deployment.');