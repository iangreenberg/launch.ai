import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTML template with the correct script loading path for Vercel
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
    /* Critical CSS */
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f8f9fa;
      color: #1a1a1a;
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
      text-align: center;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 107, 0, 0.1);
      border-radius: 50%;
      border-top-color: #ff6b00;
      animation: spin 1s ease infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .loading-text {
      margin-top: 20px;
      font-weight: 500;
      color: #555;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading-container">
      <h1>Launch.ai</h1>
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading AI Solutions...</div>
    </div>
  </div>
  
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;

export function getStaticHTML() {
  return htmlTemplate;
}

export default { getStaticHTML };