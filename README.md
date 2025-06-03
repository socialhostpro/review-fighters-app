# Review Fighters App

A modern web application for managing and responding to business reviews across multiple platforms (Google, Yelp, Facebook).

## Features

- Multi-platform review management
- AI-powered response suggestions
- Staff management system
- Affiliate program tracking
- Analytics and reporting
- User role management (Admin, Staff, Owner, Affiliate)

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/socialhostpro/review-fighters-app.git
cd review-fighters-app

# Install dependencies
npm install

# Set up environment variables
cp environment-variables-example.txt .env.local
# Edit .env.local with your actual values

# Start development server
npm run dev
```

## Environment Setup

1. Copy `environment-variables-example.txt` to `.env.local`
2. Update the following required variables:
   - `CONVEX_DEPLOYMENT`: Your Convex deployment ID
   - `CONVEX_URL`: Your Convex deployment URL
   - `JWT_SECRET`: Secret key for JWT tokens
   - Add any other required API keys based on your usage

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run convex:dev` - Start Convex development
- `npm run convex:deploy` - Deploy Convex functions

## Updating the Application

To update to the latest version:

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild the application
npm run build

# Restart the server
npm start
```

## Technology Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Vite
- Backend:
  - Convex
  - Express
- Authentication:
  - JWT
- Deployment:
  - Railway ready
  - Docker support

## Development Guidelines

1. Always create a new branch for features/fixes
2. Follow the existing code style
3. Update environment variables example if adding new ones
4. Test thoroughly before pushing

## Troubleshooting

### Common Issues

1. Port already in use:
   ```bash
   # Kill existing Node processes
   taskkill /F /IM node.exe   # Windows
   pkill node                 # Linux/Mac
   ```

2. CSS/Tailwind issues:
   ```bash
   # Rebuild CSS
   npm run build
   ```

3. Environment variables not loading:
   - Ensure `.env.local` exists
   - Check variable names match example
   - Restart development server

## Support

For issues and feature requests, please use the GitHub issue tracker.

## License

[License Type] - See LICENSE file for details
