# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Git

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd cynco-investor-relations
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and session secret
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5000` to see the application.

## Project Architecture

### Folder Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── main.tsx        # Entry point
├── server/                 # Express backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database abstraction layer
│   ├── simpleAuth.ts       # Authentication configuration
│   ├── utils/              # Server utilities
│   └── index.ts            # Server entry point
├── shared/                 # Shared code between frontend/backend
│   └── schema.ts           # Database schemas and types
├── docs/                   # Documentation
├── tests/                  # Test files
└── .github/                # GitHub templates and workflows
```

### Technology Stack

**Frontend**
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- React Hook Form for form handling
- Tailwind CSS + Shadcn/ui for styling
- Recharts for data visualization

**Backend**
- Node.js with Express
- TypeScript
- Passport.js for authentication
- Drizzle ORM for database operations
- PostgreSQL for data storage

**Development Tools**
- Vite for frontend builds
- ESLint + Prettier for code formatting
- Jest for testing
- GitHub Actions for CI/CD

## Development Workflow

### Creating New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Database Changes** (if needed)
   - Add new tables/columns to `shared/schema.ts`
   - Update storage interface in `server/storage.ts`
   - Push schema changes: `npm run db:push`

3. **Backend Development**
   - Add API routes in `server/routes.ts`
   - Implement storage methods
   - Add input validation

4. **Frontend Development**
   - Create React components in `client/src/components/`
   - Add pages in `client/src/pages/`
   - Create custom hooks for data fetching
   - Add routing in `client/src/App.tsx`

5. **Testing**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

### Code Style Guidelines

**TypeScript**
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper generic constraints
- Add JSDoc comments for public APIs

**React**
- Use functional components with hooks
- Extract custom hooks for complex logic
- Use React.memo for performance optimization
- Follow component composition patterns

**Backend**
- Use dependency injection for testability
- Implement proper error handling
- Add request validation for all endpoints
- Use async/await consistently

### Database Development

**Schema Changes**
```typescript
// shared/schema.ts
export const newTable = pgTable("new_table", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Storage Methods**
```typescript
// server/storage.ts
async getNewItems(): Promise<NewItem[]> {
  return await db.select().from(newTable);
}

async createNewItem(item: InsertNewItem): Promise<NewItem> {
  const [newItem] = await db.insert(newTable).values(item).returning();
  return newItem;
}
```

**API Routes**
```typescript
// server/routes.ts
app.get("/api/new-items", isAuthenticated, async (req, res) => {
  try {
    const items = await storage.getNewItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});
```

### Testing Strategy

**Unit Tests**
- Test individual functions and components
- Mock external dependencies
- Focus on business logic

**Integration Tests**
- Test API endpoints
- Test database operations
- Test authentication flows

**E2E Tests**
- Test complete user workflows
- Test critical paths
- Test across different browsers

**Example Test**
```typescript
describe('API /api/stakeholders', () => {
  it('should return stakeholders for authenticated users', async () => {
    const response = await request(app)
      .get('/api/stakeholders')
      .set('Cookie', authenticatedCookie)
      .expect(200);
    
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

## Security Guidelines

### Input Validation
- Validate all user inputs
- Use Zod schemas for validation
- Sanitize HTML content
- Prevent SQL injection

### Authentication
- Use secure session configuration
- Implement proper logout
- Check permissions for all operations
- Use rate limiting for sensitive endpoints

### Data Protection
- Encrypt sensitive data
- Use HTTPS in production
- Implement proper CORS
- Add security headers

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtualization for large lists
- Optimize bundle size with code splitting
- Use service workers for caching

### Backend
- Implement database connection pooling
- Use database indexes effectively
- Cache frequently accessed data
- Optimize database queries

### Database
- Use proper indexes
- Implement pagination
- Avoid N+1 queries
- Monitor query performance

## Common Patterns

### Data Fetching Hook
```typescript
export function useStakeholders() {
  return useQuery({
    queryKey: ['/api/stakeholders'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Form Component
```typescript
const form = useForm<InsertStakeholder>({
  resolver: zodResolver(insertStakeholderSchema),
  defaultValues: {
    name: '',
    email: '',
    type: 'investor',
  },
});
```

### API Route Pattern
```typescript
app.post("/api/stakeholders", isAuthenticated, requireAdmin, async (req, res) => {
  try {
    const validatedData = insertStakeholderSchema.parse(req.body);
    const stakeholder = await storage.createStakeholder(validatedData);
    res.status(201).json(stakeholder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
```

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Check DATABASE_URL environment variable
- Ensure database is running
- Verify network connectivity

**Authentication Issues**
- Check SESSION_SECRET is set
- Verify cookie settings
- Clear browser cookies

**Build Errors**
- Run `npm install` to update dependencies
- Check TypeScript errors
- Verify import paths

**Performance Issues**
- Check database query performance
- Profile React components
- Monitor network requests

### Debug Mode
```bash
LOG_LEVEL=debug npm run dev
```

### Database Debugging
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC;
```

## Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=long-random-string
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Build Process
```bash
npm run build
npm start
```

### Health Checks
The application provides health check endpoints:
- `GET /health` - Basic health check
- `GET /api/health` - API health check

## Contributing Guidelines

1. Follow the coding standards
2. Write tests for new features
3. Update documentation
4. Create descriptive commit messages
5. Submit pull requests for review

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.