// Enhanced static HTML generator with fallbacks for Vercel deployment
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name (accounting for ESM and CJS environments)
let __dirname;
try {
  const __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch (error) {
  // Fallback for CommonJS environments
  __dirname = path.dirname(new URL(import.meta.url).pathname);
}

// Custom paths for checking HTML files
const possibleHtmlPaths = [
  path.join(__dirname, '..', 'vercel.html'),
  path.join(__dirname, '..', 'dist', 'public', 'index.html'),
  path.join(__dirname, '..', 'dist', 'index.html'),
  path.join(__dirname, '..', 'client', 'index.html'),
  path.join(__dirname, '..', 'index.html')
];

// Main HTML template with the correct script loading path for Vercel
const htmlTemplate = `<!DOCTYPE html>
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

// Try to read HTML from file system
function tryReadHtmlFromFiles() {
  for (const htmlPath of possibleHtmlPaths) {
    try {
      if (fs.existsSync(htmlPath)) {
        console.log(`Reading HTML from ${htmlPath}`);
        const content = fs.readFileSync(htmlPath, 'utf8');
        
        // Patch the script path if needed for Vercel
        if (content.includes('src="/src/main.tsx"')) {
          return content.replace(
            '<script type="module" src="/src/main.tsx"></script>',
            '<script type="module" src="/assets/index.js"></script>'
          );
        }
        
        return content;
      }
    } catch (error) {
      console.error(`Error reading ${htmlPath}:`, error);
      // Continue to the next file
    }
  }
  
  // No files found or readable
  return null;
}

// Public function to get HTML content
export function getStaticHTML() {
  // First try to read from files
  const fileHtml = tryReadHtmlFromFiles();
  if (fileHtml) {
    return fileHtml;
  }
  
  // Fall back to the template
  console.log('Using fallback HTML template');
  return htmlTemplate;
}

// For direct imports
export default { getStaticHTML };

// For CommonJS compatibility
module.exports = {
  getStaticHTML,
  default: { getStaticHTML }
};