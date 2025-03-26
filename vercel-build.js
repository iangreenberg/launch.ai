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

// Copy the correct index.html to the root directory
const mainIndexPath = path.join(__dirname, 'client', 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

// Make sure the index.html has the right entry point
if (fs.existsSync(rootIndexPath)) {
  const content = fs.readFileSync(rootIndexPath, 'utf8');
  // Ensure the entry point is correct
  if (content.includes('src="/client/src/main.tsx"')) {
    console.log('⚠️ Fixing entry point in index.html');
    const updatedContent = content.replace('src="/client/src/main.tsx"', 'src="/src/main.tsx"');
    fs.writeFileSync(rootIndexPath, updatedContent);
    console.log('✅ Root index.html updated with correct entry point');
  } else {
    console.log('✅ Root index.html entry point is correct');
  }
} else if (fs.existsSync(mainIndexPath)) {
  const content = fs.readFileSync(mainIndexPath, 'utf8');
  console.log('✅ Found client/index.html, copying to root');
  fs.writeFileSync(rootIndexPath, content);
  console.log('✅ Root index.html updated with client/index.html content');
} else {
  console.warn('⚠️ No index.html found');
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
execute('npm run build');

// Add needed files to ensure proper Vercel deployment
console.log('📝 Adding vercel.json to the dist directory if not present');
const vercelJsonPath = path.join(__dirname, 'vercel.json');
const distVercelJsonPath = path.join(__dirname, 'dist', 'vercel.json');

if (fs.existsSync(vercelJsonPath) && !fs.existsSync(distVercelJsonPath)) {
  fs.copyFileSync(vercelJsonPath, distVercelJsonPath);
  console.log('✅ vercel.json copied to dist directory');
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

console.log('✅ Build process complete');
console.log('🌐 The application is ready for Vercel deployment');