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

// Copy the correct index.html to the root directory
const mainIndexPath = path.join(__dirname, 'client', 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

// Make sure we have the client/index.html as our primary index.html
if (fs.existsSync(mainIndexPath)) {
  const content = fs.readFileSync(mainIndexPath, 'utf8');
  console.log('✅ Found client/index.html, copying to root');
  fs.writeFileSync(rootIndexPath, content);
  console.log('✅ Root index.html updated with client/index.html content');
} else {
  console.warn('⚠️ client/index.html not found');
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

console.log('✅ Build process complete');
console.log('🌐 The application is ready for Vercel deployment');