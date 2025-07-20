# Deployment Guide

## GitHub Setup & Code Push Instructions

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it: `cynco-investor-relations`
3. Set it to **Public** (for open source) or **Private**
4. Don't initialize with README (we already have one)

### Step 2: Push Code to GitHub

Open terminal in your project directory and run these commands:

```bash
# Remove any existing git locks
rm -f .git/index.lock .git/config.lock

# Initialize git if not already done
git init

# Set your git config
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Cynco Investor Relations Platform

- Built secure, production-ready investor relations platform
- Implemented role-based authentication with session management
- Added comprehensive security middleware (CORS, CSP, rate limiting)
- Created full open source documentation suite
- Added CI/CD pipeline with automated testing
- Integrated company logo branding throughout application
- Set up PostgreSQL database with Drizzle ORM
- Implemented React frontend with TypeScript and Tailwind CSS
- Added comprehensive testing framework with Jest
- Enhanced with ESLint security rules and code formatting
- Ready for GitHub deployment and contributor onboarding"

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/cynco-investor-relations.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy on Replit (Recommended)

Your app is already configured for Replit deployment:

1. **Environment Variables**: Set these in your deployment environment:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string
   - `NODE_ENV`: Set to `production`

2. **Database Setup**: 
   - The app uses PostgreSQL with Drizzle ORM
   - Run `npm run db:push` to set up database schema

3. **Build Process**:
   - Run `npm run build` to build for production
   - Start with `npm start`

### Step 4: Alternative Deployment Platforms

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

#### Railway
```bash
npm install -g @railway/cli
railway login
railway deploy
```

### Environment Configuration

Create `.env.production` with:
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_random_string_at_least_32_characters
NODE_ENV=production
```

### Database Migration

After deployment, run:
```bash
npm run db:push
```

This will create all necessary database tables using your Drizzle schema.

### Security Checklist

- ✅ Environment variables properly set
- ✅ HTTPS enabled in production
- ✅ Database connection secured
- ✅ Session secret is strong and unique
- ✅ CORS configured for your domain
- ✅ Security headers enabled

### Monitoring

The app includes:
- Health check endpoint: `/health`
- Structured logging for debugging
- Error tracking in console
- Performance monitoring ready

### Getting Help

- Check `README.md` for detailed setup instructions
- Review `CONTRIBUTING.md` for development guidelines
- See `API.md` for API documentation
- Report issues using GitHub issue templates

## Quick Deployment Commands

```bash
# Install dependencies
npm install

# Set up database
npm run db:push

# Build for production
npm run build

# Start production server
npm start
```

Your app will be available at the provided URL with full functionality!