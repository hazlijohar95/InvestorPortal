# Cynco Investor Relations Platform

A modern, secure investor relations platform built for startups to manage stakeholder communications, cap tables, fundraising timelines, and business analytics.

## 🚀 Features

- **Secure Authentication** - Role-based access control with session management
- **Cap Table Management** - Real-time stakeholder tracking and ownership visualization
- **Fundraising Timeline** - Interactive milestone tracking with progress analytics
- **Business Intelligence** - Advanced analytics dashboard with exportable reports
- **Document Management** - Secure document sharing with categorization
- **Ask Board** - Investor request and communication system
- **Real-time Updates** - Live data synchronization across all features

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: TanStack Query
- **Deployment**: Replit (production-ready)

## 🔒 Security Features

- Session-based authentication with secure cookie handling
- Role-based access control (Admin/Investor permissions)
- SQL injection prevention with parameterized queries
- CORS protection and security headers
- Environment variable protection
- Database connection pooling with secure configurations

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cynco-investor-relations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Configure your DATABASE_URL and SESSION_SECRET
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Express backend application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database abstraction layer
│   ├── simpleAuth.ts       # Authentication configuration
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema definitions
└── docs/                   # Documentation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Create a Pull Request

### Code Standards

- TypeScript for all new code
- ESLint and Prettier for code formatting
- Conventional commits for commit messages
- Unit tests for new features
- Documentation for public APIs

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - Authentication and user management
- **Stakeholders** - Cap table entries with ownership data
- **Milestones** - Fundraising timeline events
- **Updates** - Company announcements and progress reports
- **Documents** - File management with categorization
- **Asks** - Investor requests and communications

## 🔐 Environment Variables

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-session-secret
NODE_ENV=development
```

## 📈 API Documentation

### Authentication Endpoints
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/auth/user` - Get current user

### Data Endpoints
- `GET /api/metrics` - Business metrics
- `GET /api/stakeholders` - Cap table data
- `GET /api/milestones` - Timeline milestones
- `GET /api/updates` - Company updates
- `GET /api/documents` - Document list
- `GET /api/asks` - Investor requests

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

The application is configured for deployment on Replit with automatic scaling and SSL certificates.

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Create an [Issue](https://github.com/your-org/cynco-investor-relations/issues) for bug reports
- Start a [Discussion](https://github.com/your-org/cynco-investor-relations/discussions) for questions
- Check our [Documentation](docs/) for detailed guides

## 👥 Contributors

Thanks to all contributors who have helped make this project better!

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for transparent investor relations
- Designed for startup scalability and security

---

**Made with ❤️ for the startup ecosystem**