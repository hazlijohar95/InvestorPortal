# Investor Relations Platform

## Overview

This is a full-stack TypeScript application built for investor relations management. The platform allows companies to share updates, manage cap tables, track milestones, and communicate with investors through a comprehensive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (July 2025)

### Open Source & Security Enhancements
- ✅ Added comprehensive security middleware (CORS, CSP, rate limiting, security headers)
- ✅ Enhanced authentication with constant-time password comparison and input validation
- ✅ Created comprehensive documentation (README, CONTRIBUTING, SECURITY, API docs)
- ✅ Added GitHub templates for issues, PRs, and CI/CD workflows
- ✅ Implemented security utilities (validation, logging, rate limiting)
- ✅ Added ESLint security rules and Prettier configuration
- ✅ Created Jest testing framework setup
- ✅ Added MIT license for open source release
- ✅ Enhanced error handling and logging throughout the application
- ✅ Made application production-ready with proper environment configuration

## System Architecture

The application follows a full-stack monorepo structure with clear separation between frontend, backend, and shared code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Authentication**: Session-based with PostgreSQL session store

## Key Components

### Frontend Architecture
- **React Router**: Using Wouter for lightweight routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

### Backend Architecture
- **API Layer**: RESTful Express.js server with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL via Neon serverless
- **Authentication**: Passport.js with local strategy and session management
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Database Schema
The application manages several core entities:
- **Users**: Authentication and user management
- **Metrics**: Company KPIs and financial data
- **Updates**: Company announcements and progress reports
- **Stakeholders**: Cap table and equity information
- **Milestones**: Timeline and goal tracking
- **Documents**: File management and sharing
- **Asks**: Help requests and networking
- **Responses**: Communication and engagement tracking

## Data Flow

1. **Authentication Flow**: Users authenticate via login form, creating server-side sessions
2. **API Communication**: Frontend makes HTTP requests to `/api/*` endpoints with session cookies
3. **Database Operations**: Server uses Drizzle ORM to interact with PostgreSQL
4. **Real-time Updates**: TanStack Query provides optimistic updates and cache management
5. **File Handling**: Documents are managed via external links (Google Drive, etc.)

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Session Management**: PostgreSQL-backed session storage

### Authentication
- **Security-Enhanced**: Constant-time password comparison, input validation, rate limiting
- **Session Management**: PostgreSQL-backed sessions with secure cookie configuration
- **Demo Accounts**: Four predefined users for demonstration
  - **Admin**: hello@cynco.io / admin123123
  - **Investor**: investor@cynco.io / investor@25!
  - **Real User**: hazli.johar@cynco.io (production user)
  - **Demo User**: paan@demo.com / 123!123!123!

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **TailwindCSS**: Utility-first styling
- **React Hook Form**: Form management and validation

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Backend bundling for production
- **ESLint + Prettier**: Code formatting and security linting
- **Jest**: Testing framework with coverage reporting
- **GitHub Actions**: CI/CD pipeline with security scanning

## Deployment Strategy

### Development
- **Concurrent Servers**: Vite dev server proxies API requests to Express
- **Hot Reload**: Frontend changes reflect immediately
- **Database**: Connects to remote Neon PostgreSQL instance

### Production Build
1. **Frontend**: Vite builds static assets to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Uses same Neon instance with connection pooling
4. **Static Serving**: Express serves built frontend assets

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Used for session encryption
- `NODE_ENV`: Environment flag for development/production behavior

The application is designed to run on platforms like Replit with minimal configuration, requiring only database provisioning and environment variable setup.

## Open Source Readiness

### Security Features
- **Enhanced Authentication**: Secure session management with rate limiting
- **Input Validation**: Comprehensive Zod-based validation for all endpoints
- **Security Headers**: CORS, CSP, XSS protection, and security middleware
- **Error Handling**: Structured logging and secure error responses
- **Rate Limiting**: API and authentication endpoint protection

### Documentation
- **README.md**: Comprehensive project overview and quick start guide
- **CONTRIBUTING.md**: Detailed contributor guidelines with development workflow
- **SECURITY.md**: Security policy and vulnerability reporting procedures
- **API.md**: Complete API documentation with examples
- **DEVELOPMENT.md**: Development guide with architecture and patterns
- **DEPLOYMENT.md**: Production deployment and scaling guide

### Developer Experience
- **GitHub Templates**: Issue and PR templates for structured contributions
- **CI/CD Pipeline**: Automated testing, linting, and security scanning
- **Code Quality**: ESLint rules, Prettier formatting, TypeScript strict mode
- **Testing Framework**: Jest setup with coverage reporting and test utilities
- **Development Workflow**: Clear guidelines for feature development and code review

### Production Readiness
- **Environment Configuration**: Secure defaults with production environment variables
- **Database Migrations**: Automated schema management with Drizzle ORM
- **Performance Optimization**: Connection pooling, caching strategies, and monitoring
- **Monitoring**: Health checks, structured logging, and error tracking
- **Scalability**: Horizontal scaling support with session store and load balancing