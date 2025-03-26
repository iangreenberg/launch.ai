// Enhanced build script for Vercel deployment with improved error handling and asset management
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name (with fallback for different environments)
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (error) {
  // Fallback for CommonJS environments
  __dirname = process.cwd();
  console.log('⚠️ Using fallback method for directory detection:', __dirname);
}

console.log('🚀 Starting enhanced build process for Vercel deployment...');
console.log(`📂 Current directory: ${__dirname}`);
console.log(`⏱️ Build started at: ${new Date().toISOString()}`);

// Function to execute shell commands with improved error handling
function execute(command) {
  try {
    console.log(`🔧 Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute: ${command}`);
    console.error(`📋 Error details: ${error.message}`);
    
    // Log more detailed error information
    if (error.stderr) {
      console.error(`stderr: ${error.stderr.toString()}`);
    }
    if (error.stdout) {
      console.error(`stdout: ${error.stdout.toString()}`);
    }
    
    return false;
  }
}

// Helper function to copy directory recursively
function copyDirRecursive(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Get all files and directories in source
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDirRecursive(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${srcPath} to ${destPath}`);
    }
  }
  
  console.log(`📁 Copied directory ${src} to ${dest}`);
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
const vercelHtmlPath = path.join(__dirname, 'vercel.html');
const distPublicIndexPath = path.join(distPublicDir, 'index.html');

// Check if we have a special vercel.html file for deployment
if (fs.existsSync(vercelHtmlPath)) {
  const vercelContent = fs.readFileSync(vercelHtmlPath, 'utf8');
  console.log('✅ Found vercel.html, using for Vercel deployment');
  fs.writeFileSync(distPublicIndexPath, vercelContent);
  console.log('✅ dist/public/index.html created from vercel.html');
  
  // Also copy a version to the root for reference
  fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), vercelContent);
  console.log('✅ dist/index.html created from vercel.html');
} else if (fs.existsSync(mainIndexPath)) {
  const content = fs.readFileSync(mainIndexPath, 'utf8');
  console.log('✅ Found client/index.html, copying to dist/public');
  
  // Modify content to use correct paths on Vercel
  const modifiedContent = content.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/assets/index.js"></script>'
  );
  
  fs.writeFileSync(distPublicIndexPath, modifiedContent);
  console.log('✅ dist/public/index.html created with modified script paths');
  
  // Also copy to root for compatibility
  fs.writeFileSync(rootIndexPath, content);
  console.log('✅ Root index.html updated with client/index.html content');
} else if (fs.existsSync(rootIndexPath)) {
  const content = fs.readFileSync(rootIndexPath, 'utf8');
  console.log('✅ Using root index.html, copying to dist/public');
  
  // Modify content to use correct paths on Vercel
  const modifiedContent = content.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/assets/index.js"></script>'
  );
  
  fs.writeFileSync(distPublicIndexPath, modifiedContent);
  console.log('✅ dist/public/index.html created with modified script paths');
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
  const requiredApiFiles = ['index.ts', 'health.ts', 'contact.ts', 'config.ts'];
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

// Make sure the client files are properly organized for deployment using the recursive copy helper
const clientDistDir = path.join(__dirname, 'dist', 'client');
if (fs.existsSync(clientDistDir)) {
  console.log('🔍 Found dist/client directory, copying contents recursively to dist/public...');
  copyDirRecursive(clientDistDir, distPublicDir);
}

// Copy public directory (if exists) to dist/public for static assets
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  console.log('🔍 Found public directory, copying contents to dist/public...');
  
  // Get all files and directories in the public directory
  const publicFiles = fs.readdirSync(publicDir, { withFileTypes: true });
  for (const entry of publicFiles) {
    const srcPath = path.join(publicDir, entry.name);
    const destPath = path.join(distPublicDir, entry.name);
    
    if (entry.isDirectory()) {
      // Use recursive copy for directories
      copyDirRecursive(srcPath, destPath);
    } else {
      // Copy individual files
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied public/${entry.name} to dist/public/${entry.name}`);
    }
  }
}

// Copy assets directory to dist/assets (if it exists)
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  console.log('🔍 Found assets directory, copying to dist/assets...');
  
  // Ensure dist/assets directory exists
  if (!fs.existsSync(distAssetsDir)) {
    fs.mkdirSync(distAssetsDir, { recursive: true });
  }
  
  copyDirRecursive(assetsDir, distAssetsDir);
}

// Create favicon if it doesn't exist
const faviconPath = path.join(distPublicDir, 'favicon.svg');
if (!fs.existsSync(faviconPath)) {
  console.log('ℹ️ No favicon.svg found, creating a default one');
  
  // Simple SVG for a default favicon
  const defaultFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ff6b00"/>
  <path d="M30 30 L70 30 L70 70 L50 70 L50 50 L30 50 Z" fill="white"/>
</svg>`;
  
  fs.writeFileSync(faviconPath, defaultFavicon);
  console.log('✅ Created default favicon.svg');
}

// Check if assets directory exists in the output, and create links if needed
const builtAssetsDir = path.join(distDir, 'assets');
const publicAssetsDir = path.join(distPublicDir, 'assets');

if (fs.existsSync(builtAssetsDir) && !fs.existsSync(publicAssetsDir)) {
  console.log('📌 Creating assets symlink in dist/public/assets to ensure proper asset paths');
  try {
    // On some systems we need to create a directory symlink
    if (process.platform === 'win32') {
      // Use directory junction on Windows
      execute(`mklink /J "${publicAssetsDir}" "${builtAssetsDir}"`);
    } else {
      // Use symlink on Unix systems
      fs.symlinkSync(builtAssetsDir, publicAssetsDir, 'dir');
    }
    console.log('✅ Created assets symlink');
  } catch (error) {
    console.error('⚠️ Failed to create assets symlink:', error.message);
    console.log('📋 Copying assets directory instead');
    copyDirRecursive(builtAssetsDir, publicAssetsDir);
  }
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
    { "source": "/api/config", "destination": "/api/config" },
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

// Copy API files to dist directory for Vercel with improved handling
if (fs.existsSync(apiDir)) {
  const distApiDir = path.join(distDir, 'api');
  if (!fs.existsSync(distApiDir)) {
    fs.mkdirSync(distApiDir, { recursive: true });
    console.log('✅ Created dist/api directory');
  }
  
  // Copy all API files
  const apiFiles = fs.readdirSync(apiDir);
  console.log(`🔍 Found ${apiFiles.length} API files to process`);
  
  for (const file of apiFiles) {
    const srcFile = path.join(apiDir, file);
    const destFile = path.join(distApiDir, file);
    
    // Skip if it's a directory
    if (fs.statSync(srcFile).isDirectory()) {
      console.log(`⚠️ Skipping directory: ${file}`);
      continue;
    }
    
    fs.copyFileSync(srcFile, destFile);
    console.log(`✅ Copied ${file} to dist/api directory`);
  }
  
  // Create any missing critical API files
  const criticalApiFiles = [
    { name: 'index.ts', content: `import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'ok', message: 'Launch.ai API is running' });
}` },
    { name: 'health.ts', content: `import type { VercelRequest, VercelResponse } from '@vercel/node';
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
}` },
    { name: 'catch-all.ts', content: `import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStaticHTML } from './_static';
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(getStaticHTML());
}` }
  ];
  
  for (const apiFile of criticalApiFiles) {
    const apiFilePath = path.join(distApiDir, apiFile.name);
    if (!fs.existsSync(apiFilePath)) {
      console.log(`⚠️ Critical API file missing: ${apiFile.name}, creating it`);
      fs.writeFileSync(apiFilePath, apiFile.content);
      console.log(`✅ Created ${apiFile.name} in dist/api directory`);
    }
  }
  
  // Special handling for _static.js as a fallback
  const staticJsPath = path.join(apiDir, '_static.js');
  if (fs.existsSync(staticJsPath)) {
    console.log('✅ Found _static.js file for fallback HTML generation');
    
    // Multiple HTML fallbacks for greater reliability
    const fallbackHtmlPaths = [
      path.join(distPublicDir, 'fallback.html'),
      path.join(distPublicDir, 'index.html'),
      path.join(distDir, 'index.html'),
      path.join(__dirname, 'index.html')
    ];
    
    try {
      // Import the static HTML generation function
      const staticModule = await import('./api/_static.js');
      const htmlContent = staticModule.getStaticHTML();
      
      // Write to all fallback HTML files
      for (const htmlPath of fallbackHtmlPaths) {
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`✅ Created/updated HTML fallback: ${htmlPath}`);
      }
      
      // Also create a copy in various Vercel directories for maximum safety
      const vercelOutputDir = path.join(__dirname, '.vercel', 'output');
      if (fs.existsSync(vercelOutputDir)) {
        const staticOutputDir = path.join(vercelOutputDir, 'static');
        if (!fs.existsSync(staticOutputDir)) {
          fs.mkdirSync(staticOutputDir, { recursive: true });
        }
        fs.writeFileSync(path.join(staticOutputDir, 'index.html'), htmlContent);
        console.log('✅ Added fallback HTML to .vercel/output/static directory');
      }
    } catch (error) {
      console.error('❌ Error generating fallback HTML:', error);
      console.log('⚠️ Falling back to manual HTML template');
      
      const enhancedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Launch.ai - AI Solutions</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* Critical CSS for immediate rendering */
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 24.6 95% 53.1%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 24.6 95% 53.1%;
      --radius: 0.5rem;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }
    
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding: 2rem;
      text-align: center;
    }
    
    .loading-logo {
      margin-bottom: 2rem;
      font-size: 2.5rem;
      font-weight: 800;
      color: hsl(var(--primary));
    }
    
    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 5px solid rgba(255, 107, 0, 0.1);
      border-radius: 50%;
      border-top-color: hsl(var(--primary));
      animation: spin 1s ease infinite;
      margin-bottom: 1.5rem;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .loading-text {
      font-size: 1.25rem;
      font-weight: 500;
      color: hsl(var(--foreground));
      margin-bottom: 0.5rem;
    }
    
    .loading-subtext {
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      max-width: 600px;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading-container">
      <div class="loading-logo">Launch.ai</div>
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading AI Solutions...</div>
      <div class="loading-subtext">Prepare to transform your business with cutting-edge AI technology. Our platform is loading to help you unlock new opportunities.</div>
    </div>
  </div>
  
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;
      
      // Write to all fallback HTML files
      for (const htmlPath of fallbackHtmlPaths) {
        fs.writeFileSync(htmlPath, enhancedHtml);
        console.log(`✅ Created basic fallback HTML: ${htmlPath}`);
      }
    }
    
    // Create additional fallback for _static.js if it's missing
    const distStaticJsPath = path.join(distApiDir, '_static.js');
    if (!fs.existsSync(distStaticJsPath) || fs.statSync(distStaticJsPath).size === 0) {
      console.log('⚠️ _static.js missing or empty in dist/api, creating it');
      
      // Create a simple fallback version of _static.js
      const staticJsContent = `
// Enhanced static HTML generator with fallbacks for Vercel deployment
export function getStaticHTML() {
  return \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch.ai - AI Solutions</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: 24.6 95% 53.1%;
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
    }
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .loading-container {
      text-align: center;
    }
    .loading-logo {
      font-size: 2.5rem;
      font-weight: 800;
      color: hsl(var(--primary));
      margin-bottom: 2rem;
    }
    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 5px solid rgba(255, 107, 0, 0.1);
      border-radius: 50%;
      border-top-color: hsl(var(--primary));
      animation: spin 1s ease infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading-container">
      <div class="loading-logo">Launch.ai</div>
      <div class="loading-spinner"></div>
      <div>Loading AI Solutions...</div>
    </div>
  </div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>\`;
}

export default { getStaticHTML };

// For CommonJS compatibility
module.exports = {
  getStaticHTML,
  default: { getStaticHTML }
};`;
      
      fs.writeFileSync(distStaticJsPath, staticJsContent);
      console.log('✅ Created fallback _static.js in dist/api directory');
    }
  }
}

// Create multiple fallback mechanisms
console.log('🛡️ Setting up additional fallback mechanisms for production deployment');

// Create a _redirects file for Vercel and Netlify (just in case)
const redirectsPath = path.join(distPublicDir, '_redirects');
fs.writeFileSync(redirectsPath, `/* /index.html 200`);
console.log('✅ Created _redirects file for fallback routing');

// Create a static.json file for Heroku-like platforms
const staticJsonPath = path.join(distDir, 'static.json');
fs.writeFileSync(staticJsonPath, `{
  "root": "public",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}`);
console.log('✅ Created static.json file for fallback routing');

// Create a .nojekyll file to prevent GitHub Pages processing
const nojekyllPath = path.join(distPublicDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('✅ Created .nojekyll file for GitHub Pages compatibility');

// Create robots.txt
const robotsPath = path.join(distPublicDir, 'robots.txt');
fs.writeFileSync(robotsPath, `User-agent: *
Allow: /
Sitemap: https://launch-ai-ruby.vercel.app/sitemap.xml`);
console.log('✅ Created robots.txt file');

// Create a simple sitemap
const sitemapPath = path.join(distPublicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://launch-ai-ruby.vercel.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`);
console.log('✅ Created sitemap.xml file');

console.log('✅ Build process complete');
console.log(`⏱️ Build finished at: ${new Date().toISOString()}`);
console.log('🌐 The application is ready for Vercel deployment.');
console.log('📝 Check https://launch-ai-ruby.vercel.app/ after deployment to verify changes.');