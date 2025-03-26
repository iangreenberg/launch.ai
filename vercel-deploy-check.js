// This script checks for Vercel deployment issues and provides diagnostic information
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import https from 'https';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running enhanced Vercel deployment diagnostic checks...');

// Function to make an HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          data: data.substring(0, 200) + '...' // Show just the first 200 chars
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Check for critical files in the expected locations
const files = [
  { path: 'vercel.json', required: true },
  { path: 'index.html', required: true },
  { path: 'client/index.html', required: true },
  { path: 'api/index.ts', required: true },
  { path: 'api/health.ts', required: true },
  { path: 'api/contact.ts', required: true },
  { path: 'api/config.ts', required: true },
  { path: 'dist/index.js', required: false },
  { path: 'dist/public/index.html', required: false },
  { path: 'dist/vercel.json', required: false }
];

console.log('\n📁 File Structure Checks:');
// Check for each file and print status
files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : file.required ? '❌' : '⚠️';
  console.log(`${status} ${file.path}: ${exists ? 'exists' : 'missing'}`);
  
  // For HTML files, check if they have the correct content
  if (exists && file.path.endsWith('.html')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasRootDiv = content.includes('<div id="root"></div>');
    const hasScriptTag = content.includes('<script type="module" src=');
    console.log(`  - ${hasRootDiv ? '✅' : '❌'} Has root div: ${hasRootDiv}`);
    console.log(`  - ${hasScriptTag ? '✅' : '❌'} Has script tag: ${hasScriptTag}`);
    
    // Show entry point path
    if (hasScriptTag) {
      const match = content.match(/<script type="module" src="([^"]+)"/);
      if (match) {
        console.log(`  - Entry point: ${match[1]}`);
      }
    }
  }
  
  // For vercel.json, do a quick validation
  if (exists && file.path.endsWith('vercel.json')) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`  - Has routes: ${content.routes ? '✅' : '❌'}`);
      console.log(`  - Has rewrites: ${content.rewrites ? '✅' : '❌'}`);
    } catch (err) {
      console.log(`  - ❌ Invalid JSON: ${err.message}`);
    }
  }
});

// Check vercel.json configuration
const vercelJsonPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelJsonPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    
    console.log('\n📄 Vercel Configuration:');
    console.log(`- Version: ${vercelConfig.version}`);
    console.log(`- Build Command: ${vercelConfig.buildCommand}`);
    console.log(`- Output Directory: ${vercelConfig.outputDirectory}`);
    
    // Check routes configuration
    if (vercelConfig.routes && vercelConfig.routes.length > 0) {
      console.log(`- Routes: ${vercelConfig.routes.length} defined`);
      
      // Check for catch-all route
      const hasCatchAll = vercelConfig.routes.some(route => 
        route.src && (route.src.includes('(.*)') || route.src.includes('/*'))
      );
      
      console.log(`  ${hasCatchAll ? '✅' : '❌'} Catch-all route: ${hasCatchAll ? 'found' : 'missing'}`);
      
      // Print all routes for debugging
      console.log('  Route definitions:');
      vercelConfig.routes.forEach((route, i) => {
        console.log(`  ${i+1}. ${JSON.stringify(route)}`);
      });
    } else {
      console.log('❌ Routes: None defined');
    }
    
    // Check rewrites configuration
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      console.log(`- Rewrites: ${vercelConfig.rewrites.length} defined`);
      
      // Print all rewrites for debugging
      console.log('  Rewrite definitions:');
      vercelConfig.rewrites.forEach((rewrite, i) => {
        console.log(`  ${i+1}. ${JSON.stringify(rewrite)}`);
      });
    } else {
      console.log('⚠️ Rewrites: None defined');
    }
    
    // Check headers configuration
    if (vercelConfig.headers && vercelConfig.headers.length > 0) {
      console.log(`- Headers: ${vercelConfig.headers.length} defined`);
      
      // Check for CORS headers
      const hasCors = vercelConfig.headers.some(header => 
        header.headers && header.headers.some(h => 
          h.key && h.key.toLowerCase().includes('access-control')
        )
      );
      
      console.log(`  ${hasCors ? '✅' : '⚠️'} CORS headers: ${hasCors ? 'found' : 'missing'}`);
    } else {
      console.log('⚠️ Headers: None defined');
    }
  } catch (error) {
    console.error('❌ Error parsing vercel.json:', error.message);
  }
} else {
  console.error('❌ vercel.json not found!');
}

// Check vite.config.ts
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
if (fs.existsSync(viteConfigPath)) {
  const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  
  console.log('\n📄 Vite Configuration Checks:');
  
  // Check for outDir configuration
  const hasOutDir = viteConfig.includes('outDir:') || viteConfig.includes('outDir =');
  console.log(`${hasOutDir ? '✅' : '⚠️'} Output directory configuration: ${hasOutDir ? 'found' : 'not explicitly set'}`);
  
  // Check for root directory
  const hasRoot = viteConfig.includes('root:') || viteConfig.includes('root =');
  console.log(`${hasRoot ? '✅' : '⚠️'} Root directory configuration: ${hasRoot ? 'found' : 'not explicitly set'}`);
  
  // If it has a root, find what it is
  if (hasRoot) {
    const rootMatch = viteConfig.match(/root:\s*['"](.*?)['"]/m) || viteConfig.match(/root\s*=\s*['"](.*?)['"]/m);
    if (rootMatch) {
      console.log(`  - Root directory set to: ${rootMatch[1]}`);
    }
  }
  
  // Check for build configuration
  const hasBuildConfig = viteConfig.includes('build:') || viteConfig.includes('build =');
  console.log(`${hasBuildConfig ? '✅' : '⚠️'} Build configuration: ${hasBuildConfig ? 'found' : 'not explicitly set'}`);
  
  // If it has a build config, find what outDir is set to
  if (hasBuildConfig) {
    const outDirMatch = viteConfig.match(/outDir:\s*['"](.*?)['"]/m) || viteConfig.match(/outDir\s*=\s*['"](.*?)['"]/m);
    if (outDirMatch) {
      console.log(`  - Output directory set to: ${outDirMatch[1]}`);
    }
  }
  
  // Check for alias configuration
  const hasAlias = viteConfig.includes('alias:') || viteConfig.includes('alias =');
  console.log(`${hasAlias ? '✅' : '⚠️'} Path aliases: ${hasAlias ? 'found' : 'not explicitly set'}`);
} else {
  console.error('❌ vite.config.ts not found!');
}

// Check package.json for build script
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    console.log('\n📄 Package.json Checks:');
    
    // Check for build script
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log(`✅ Build script: "${packageJson.scripts.build}"`);
    } else {
      console.error('❌ Build script: missing');
    }
    
    // Check for important dependencies
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const checkDeps = ['vite', 'react', 'react-dom', 'express', '@vercel/node'];
    
    checkDeps.forEach(dep => {
      console.log(`${deps[dep] ? '✅' : '❌'} ${dep}: ${deps[dep] ? deps[dep] : 'missing'}`);
    });
  } catch (error) {
    console.error('❌ Error parsing package.json:', error.message);
  }
} else {
  console.error('❌ package.json not found!');
}

// Check live deployment (if possible)
console.log('\n🌐 Checking live deployment (this may take a moment)...');

(async () => {
  try {
    // Check the homepage
    const homeResult = await makeRequest('https://launch-ai-ruby.vercel.app/');
    console.log(`Home page: Status ${homeResult.statusCode}`);
    console.log(`Content-Type: ${homeResult.contentType}`);
    console.log(`First 200 chars: ${homeResult.data}`);
    
    // Check if it returns HTML or JavaScript
    if (homeResult.contentType && homeResult.contentType.includes('javascript')) {
      console.log('❌ WARNING: Homepage is returning JavaScript instead of HTML!');
      console.log('   This is likely caused by incorrect route configuration in vercel.json');
    }
    
    // Check the API health endpoint
    try {
      const apiHealthResult = await makeRequest('https://launch-ai-ruby.vercel.app/api/health');
      console.log(`\nAPI Health Endpoint: Status ${apiHealthResult.statusCode}`);
      console.log(`Content-Type: ${apiHealthResult.contentType}`);
      console.log(`Response: ${apiHealthResult.data}`);
    } catch (err) {
      console.log('❌ Could not reach API health endpoint:',  err.message);
    }
    
    // Check the API config endpoint
    try {
      const apiConfigResult = await makeRequest('https://launch-ai-ruby.vercel.app/api/config');
      console.log(`\nAPI Config Endpoint: Status ${apiConfigResult.statusCode}`);
      console.log(`Content-Type: ${apiConfigResult.contentType}`);
      console.log(`Response: ${apiConfigResult.data}`);
    } catch (err) {
      console.log('❌ Could not reach API config endpoint:',  err.message);
    }
  } catch (error) {
    console.error('❌ Error checking live deployment:', error.message);
  }
  
  console.log('\n🔍 Enhanced diagnostic check complete');
  console.log('📝 If you see any issues above, fix them and re-deploy to Vercel');
  console.log('🚀 Suggested next steps:');
  console.log('1. Make sure your vercel.json has correct routes and rewrites configured');
  console.log('2. Verify that the build script in package.json is correct');
  console.log('3. Check if the outDir in vite.config.ts matches the outputDirectory in vercel.json');
  console.log('4. After deployment, check the deployment logs in Vercel dashboard for errors');
})();