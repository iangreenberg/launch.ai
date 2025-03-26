// Utilities to help fix Vercel deployment issues for Launch.ai
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_NAME = 'launch-ai';
const SITE_URL = 'https://launch-ai-ruby.vercel.app';

// Function to check if the site is properly deployed with detailed diagnostics
async function checkDeployment() {
  try {
    console.log(`🔍 Checking main deployment at ${SITE_URL}...`);
    
    // Define UA to avoid being blocked
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; LaunchAI-Diagnostics/1.0; +https://launch-ai-ruby.vercel.app)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };
    
    const response = await fetch(SITE_URL, { headers });
    
    console.log(`📊 Status code: ${response.status} (${response.statusText})`);
    
    if (!response.ok) {
      console.error(`❌ Site returned error status code: ${response.status}`);
      
      // Try to get error message
      const errorText = await response.text();
      console.error(`Error details: ${errorText.substring(0, 500)}...`);
      
      return {
        success: false,
        status: response.status,
        error: 'Non-200 status code',
        errorDetails: errorText.substring(0, 500)
      };
    }
    
    // Log all response headers for debugging
    console.log('📋 Response headers:');
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`);
    });
    
    const contentType = response.headers.get('content-type');
    console.log(`📝 Content-Type: ${contentType}`);
    
    const content = await response.text();
    
    // Check if the response is HTML
    if (contentType && contentType.includes('text/html')) {
      console.log('✅ Site is returning HTML as expected');
      
      // Additional checks on the HTML content
      const isReactApp = content.includes('<div id="root">') || content.includes('<div id="app">');
      const hasScriptTags = content.includes('<script');
      const hasDocType = content.toLowerCase().includes('<!doctype html>') || content.includes('<!DOCTYPE html>');
      
      console.log(`📊 HTML analysis:`);
      console.log(`  - Has doctype declaration: ${hasDocType ? '✅' : '❌'}`);
      console.log(`  - Contains React root element: ${isReactApp ? '✅' : '❌'}`);
      console.log(`  - Contains script tags: ${hasScriptTags ? '✅' : '❌'}`);
      
      // Show a reasonable portion of the content
      console.log(`📄 First 300 characters of content:\n${content.substring(0, 300)}...\n`);
      
      if (content.includes('import') && content.includes('export') && !hasDocType) {
        console.log('⚠️ WARNING: Response appears to be JavaScript code instead of HTML!');
        console.log('This suggests server-side code is being exposed rather than executed.');
        
        return {
          success: false,
          status: response.status,
          contentType,
          htmlOk: false,
          isJsCode: true,
          sample: content.substring(0, 500)
        };
      }
      
      return {
        success: true,
        status: response.status,
        contentType,
        htmlOk: true,
        isReactApp,
        hasScriptTags,
        hasDocType,
        sample: content.substring(0, 300)
      };
    } else {
      console.error('❌ Site is not returning HTML content');
      console.log(`First 300 characters of content:\n${content.substring(0, 300)}...\n`);
      
      return {
        success: false,
        status: response.status,
        contentType,
        htmlOk: false,
        sample: content.substring(0, 500)
      };
    }
  } catch (error) {
    console.error('❌ Error checking deployment:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

// Function to check basic API endpoints with detailed reporting
async function checkApiEndpoints() {
  const endpoints = [
    '/api',
    '/api/health',
    '/api/config',
    '/api/contact',
    '/api/catch-all'
  ];
  
  console.log('🔍 Checking API endpoints...');
  const results = {};
  
  // Headers for API requests
  const headers = {
    'User-Agent': 'Mozilla/5.0 (compatible; LaunchAI-Diagnostics/1.0; +https://launch-ai-ruby.vercel.app)',
    'Accept': 'application/json, text/plain, */*'
  };
  
  for (const endpoint of endpoints) {
    const url = `${SITE_URL}${endpoint}`;
    try {
      console.log(`📡 Testing API endpoint: ${url}`);
      const response = await fetch(url, { headers });
      
      const contentType = response.headers.get('content-type');
      console.log(`  Status: ${response.status} (${response.statusText})`);
      console.log(`  Content-Type: ${contentType}`);
      
      results[endpoint] = {
        status: response.status,
        statusText: response.statusText,
        contentType,
        success: response.status >= 200 && response.status < 300
      };
      
      // Get the response body based on content type
      let responseBody;
      
      if (contentType?.includes('application/json')) {
        try {
          responseBody = await response.json();
          results[endpoint].data = responseBody;
          console.log(`  Response: ${JSON.stringify(responseBody).substring(0, 100)}${JSON.stringify(responseBody).length > 100 ? '...' : ''}`);
        } catch (jsonError) {
          console.error(`  ❌ Error parsing JSON from ${endpoint}:`, jsonError.message);
          const text = await response.text();
          results[endpoint].text = text;
          results[endpoint].jsonError = jsonError.message;
          console.log(`  Response text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        }
      } else {
        responseBody = await response.text();
        results[endpoint].text = responseBody;
        console.log(`  Response text: ${responseBody.substring(0, 100)}${responseBody.length > 100 ? '...' : ''}`);
        
        // Check if this might actually be JSON despite the content-type
        if (responseBody.trim().startsWith('{') || responseBody.trim().startsWith('[')) {
          console.log('  ⚠️ Response looks like JSON but content-type is not application/json');
          try {
            results[endpoint].parsedData = JSON.parse(responseBody);
          } catch (e) {
            // Not valid JSON after all
          }
        }
        
        // Check if this is server-side code being exposed
        if (responseBody.includes('import') && responseBody.includes('export default')) {
          console.log('  ⚠️ WARNING: API endpoint is returning what appears to be server-side code!');
          results[endpoint].exposingServerCode = true;
        }
      }
      
    } catch (error) {
      console.error(`  ❌ Error checking ${endpoint}:`, error.message);
      results[endpoint] = { 
        error: error.message,
        success: false
      };
    }
    
    // Add visual separator between endpoints
    console.log('  ---------------------------------------');
  }
  
  return results;
}

// Function to verify key files exist in the project with size and content checks
function checkDeploymentFiles() {
  const requiredFiles = [
    'vercel.json',
    'vercel-build.js',
    'api/index.ts',
    'api/health.ts',
    'api/config.ts',
    'api/contact.ts',
    'api/_static.js',
    'api/[...path].ts',
    'api/catch-all.ts',
    'vercel.html',
    'public/index.html'
  ];
  
  console.log('📋 Checking required deployment files...');
  const results = {};
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    
    results[file] = { exists };
    
    if (exists) {
      try {
        const stats = fs.statSync(filePath);
        results[file].size = stats.size;
        results[file].isDirectory = stats.isDirectory();
        
        // Only check content of key files
        if (!stats.isDirectory() && 
            (file === 'vercel.json' || 
             file === 'api/_static.js' || 
             file === 'api/[...path].ts' || 
             file === 'api/catch-all.ts')) {
          
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Perform specific checks based on file type
          if (file === 'vercel.json') {
            try {
              const vercelConfig = JSON.parse(content);
              results[file].valid = true;
              results[file].hasRoutes = Array.isArray(vercelConfig.routes) && vercelConfig.routes.length > 0;
              results[file].hasRewrites = Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.length > 0;
              results[file].hasBuilds = Array.isArray(vercelConfig.builds) && vercelConfig.builds.length > 0;
            } catch (e) {
              results[file].valid = false;
              results[file].parseError = e.message;
            }
          }
          
          if (file === 'api/_static.js') {
            results[file].hasGetStaticHTML = content.includes('getStaticHTML');
            results[file].hasHtmlTemplate = content.includes('<!DOCTYPE html>') || content.includes('<!doctype html>');
          }
          
          if (file === 'api/[...path].ts' || file === 'api/catch-all.ts') {
            results[file].importsFsModule = content.includes('import fs');
            results[file].usesStaticHTML = content.includes('getStaticHTML');
            results[file].returnsHtml = content.includes('text/html');
          }
        }
        
        console.log(`✅ ${file}: ${stats.size} bytes`);
      } catch (error) {
        results[file].error = error.message;
        console.error(`❌ Error checking ${file}:`, error.message);
      }
    } else {
      console.error(`❌ Missing file: ${file}`);
    }
  }
  
  return results;
}

// Function to suggest fixes based on diagnostic results
function suggestFixes(deploymentResult, apiResults, fileResults) {
  console.log('📝 Generating suggestions based on diagnostic results...');
  
  const suggestions = [];
  const criticalIssues = [];
  const warnings = [];
  
  // Check main site deployment
  if (!deploymentResult.success) {
    if (deploymentResult.isJsCode) {
      criticalIssues.push(
        '🚨 CRITICAL: The main site is returning JavaScript code instead of HTML!',
        '   This indicates the server-side code is being exposed rather than executed.',
        '   This is a common Vercel deployment issue with incorrect endpoint handling.'
      );
      
      suggestions.push(
        '1️⃣ Update your vercel.json file with proper routing rules:',
        '   - Ensure catch-all routes send client requests to your HTML file',
        '   - Configure proper builds for your API endpoints',
        '   - Add catch-all API handler for non-API routes'
      );
      
      suggestions.push(
        '2️⃣ Make your build script create proper static files:',
        '   - Generate HTML files in dist/public',
        '   - Create separate HTML fallbacks as safety nets',
        '   - Ensure proper handling of JS/CSS assets'
      );
    } else {
      criticalIssues.push(
        `🚨 Main site deployment issue: ${deploymentResult.error || 'Unknown error'}`
      );
    }
  }
  
  // Check API endpoints
  const apiIssues = Object.entries(apiResults).filter(
    ([_, result]) => !result.success || result.exposingServerCode
  );
  
  if (apiIssues.length > 0) {
    criticalIssues.push('🚨 API endpoint issues detected:');
    
    apiIssues.forEach(([endpoint, result]) => {
      if (result.exposingServerCode) {
        criticalIssues.push(`   - ${endpoint}: Exposing server-side code instead of executing it!`);
      } else if (result.error) {
        criticalIssues.push(`   - ${endpoint}: ${result.error}`);
      } else {
        criticalIssues.push(`   - ${endpoint}: Status ${result.status} (${result.statusText || 'Error'})`);
      }
    });
    
    suggestions.push(
      '3️⃣ Fix API endpoint issues:',
      '   - Ensure each API file exports a proper handler function',
      '   - Verify endpoint files are properly transpiled for Vercel',
      '   - Check that all imports resolve correctly'
    );
  }
  
  // Check deployment files
  const missingFiles = Object.entries(fileResults)
    .filter(([_, info]) => !info.exists)
    .map(([file]) => file);
  
  if (missingFiles.length > 0) {
    warnings.push('⚠️ Missing required files:');
    missingFiles.forEach(file => {
      warnings.push(`   - ${file}`);
    });
    
    suggestions.push(
      '4️⃣ Create all required deployment files:',
      '   - Ensure vercel.json is properly configured',
      '   - Create catch-all handlers for HTML delivery',
      '   - Add proper fallback mechanisms'
    );
  }
  
  // Check file content issues
  const contentIssues = [];
  
  if (fileResults['vercel.json']?.exists && !fileResults['vercel.json']?.hasRoutes) {
    contentIssues.push('   - vercel.json is missing proper routes configuration');
  }
  
  if (fileResults['api/_static.js']?.exists && !fileResults['api/_static.js']?.hasHtmlTemplate) {
    contentIssues.push('   - api/_static.js is missing HTML template content');
  }
  
  if (fileResults['api/[...path].ts']?.exists && !fileResults['api/[...path].ts']?.returnsHtml) {
    contentIssues.push('   - api/[...path].ts is not properly configured to return HTML');
  }
  
  if (contentIssues.length > 0) {
    warnings.push('⚠️ Issues with file contents:');
    contentIssues.forEach(issue => warnings.push(issue));
    
    suggestions.push(
      '5️⃣ Fix content issues in deployment files:',
      '   - Update static HTML generators with proper templates',
      '   - Ensure catch-all handlers serve HTML content',
      '   - Verify JSON configuration is valid'
    );
  }
  
  // If no issues found
  if (criticalIssues.length === 0 && warnings.length === 0) {
    suggestions.push(
      '✅ All basic checks passed!',
      '   If deployment is still failing, check Vercel logs for specific errors,',
      '   or try the additional suggestions below:',
      '',
      '   - Verify Vercel project settings are correctly configured',
      '   - Check build output in Vercel deployment logs',
      '   - Try manually triggering a fresh deployment'
    );
  }
  
  return {
    criticalIssues,
    warnings,
    suggestions
  };
}

// Main diagnostic function
async function runDiagnostic() {
  console.log('══════════════════════════════════════════════════');
  console.log('   🚀 Launch.ai Vercel Deployment Diagnostic 🚀');
  console.log('══════════════════════════════════════════════════');
  console.log(`📅 ${new Date().toISOString()}`);
  console.log(`🔍 Testing site: ${SITE_URL}`);
  console.log('══════════════════════════════════════════════════\n');
  
  try {
    // Check deployment
    console.log('📝 STEP 1: Checking main site deployment...');
    console.log('------------------------------------------');
    const deploymentResult = await checkDeployment();
    
    const deploymentStatus = deploymentResult.success 
      ? '✅ PASS: Main site is properly serving HTML content'
      : '❌ FAIL: Main site is not serving HTML properly';
      
    console.log(`\n${deploymentStatus}\n`);
    
    // Check API endpoints
    console.log('📝 STEP 2: Checking API endpoints...');
    console.log('------------------------------------------');
    const apiResults = await checkApiEndpoints();
    
    const workingApis = Object.entries(apiResults).filter(([_, r]) => r.success).length;
    const totalApis = Object.keys(apiResults).length;
    
    console.log(`\n${workingApis === totalApis ? '✅' : '⚠️'} API Endpoints: ${workingApis}/${totalApis} working properly\n`);
    
    // Check required files
    console.log('📝 STEP 3: Checking deployment files...');
    console.log('------------------------------------------');
    const fileResults = checkDeploymentFiles();
    
    const existingFiles = Object.values(fileResults).filter(info => info.exists).length;
    const totalFiles = Object.keys(fileResults).length;
    
    console.log(`\n${existingFiles === totalFiles ? '✅' : '⚠️'} Deployment Files: ${existingFiles}/${totalFiles} found\n`);
    
    // Generate suggestions and diagnostic results
    const { criticalIssues, warnings, suggestions } = suggestFixes(deploymentResult, apiResults, fileResults);
    
    // Print out the summary
    console.log('══════════════════════════════════════════════════');
    console.log('   📊 DIAGNOSTIC SUMMARY');
    console.log('══════════════════════════════════════════════════');
    
    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      console.log('------------------');
      criticalIssues.forEach(issue => console.log(issue));
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      console.log('------------');
      warnings.forEach(warning => console.log(warning));
    }
    
    if (criticalIssues.length === 0 && warnings.length === 0) {
      console.log('\n✅ No critical issues or warnings found!');
    }
    
    console.log('\n🔧 RECOMMENDED ACTIONS:');
    console.log('---------------------');
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => console.log(suggestion));
    } else {
      console.log('No specific actions needed. Deployment should be working properly.');
    }
    
    console.log('\n══════════════════════════════════════════════════');
    console.log(`   📝 Diagnostic completed at ${new Date().toISOString()}`);
    console.log('══════════════════════════════════════════════════');
    
    // Return the comprehensive results
    return {
      mainSite: deploymentResult,
      apis: apiResults,
      files: fileResults,
      issues: {
        critical: criticalIssues,
        warnings
      },
      recommendations: suggestions,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error running diagnostic:', error);
    console.error(error.stack);
    
    console.log('\n══════════════════════════════════════════════════');
    console.log(`   ❌ Diagnostic failed at ${new Date().toISOString()}`);
    console.log('══════════════════════════════════════════════════');
    
    throw error;
  }
}

// Export functions
export {
  checkDeployment,
  checkApiEndpoints,
  checkDeploymentFiles,
  suggestFixes,
  runDiagnostic
};

// Run diagnostic if called directly
if (process.argv[1].endsWith('vercel-deploy-utils.js')) {
  runDiagnostic().catch(console.error);
}