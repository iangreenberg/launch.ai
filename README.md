# Launch.ai - AI Solutions Website

This is a modern, responsive website for Launch.ai, showcasing AI solutions for businesses. The website includes multiple sections like a hero section, solutions showcase, benefits section, testimonials, case studies, and a contact form.

## Features

- Modern, responsive design
- Animated UI components with Framer Motion
- Contact form with validation
- Multi-section landing page
- Ready for Vercel deployment

## Tech Stack

- React with TypeScript
- Vite for front-end tooling
- Express.js for backend APIs
- Tailwind CSS for styling
- Shadcn UI components
- React Hook Form for form handling
- Zod for validation
- Framer Motion for animations

## Deployment Instructions for Vercel

1. Push the code to a GitHub repository.
2. Log in to Vercel and click "New Project".
3. Import the GitHub repository.
4. Configure the project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add any required environment variables.
6. Click "Deploy".

## API Endpoints

- `/api` - Health check endpoint
- `/api/contact` - Contact form submission endpoint

## Local Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open `http://localhost:5000` in your browser

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express API
- `api/` - Vercel API functions
- `shared/` - Shared types and schemas
- `attached_assets/` - Project assets and images

## License

MIT