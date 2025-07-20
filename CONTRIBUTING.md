# Contributing to Cynco Investor Relations Platform

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🌟 Why Contribute?

- **Impact**: Help startups manage investor relations more effectively
- **Technology**: Work with modern React, TypeScript, and Node.js stack
- **Learning**: Gain experience with financial software and data visualization
- **Community**: Join a growing community of fintech developers
- **Recognition**: Get featured as a contributor in our project

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Basic knowledge of TypeScript/React
- Understanding of SQL and database concepts
- Git and GitHub workflow familiarity

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/cynco-investor-relations.git
   cd cynco-investor-relations
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your database credentials
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 🏗️ Project Architecture

### Frontend (React/TypeScript)
- **Components**: Reusable UI components in `client/src/components/`
- **Pages**: Route-specific pages in `client/src/pages/`
- **Hooks**: Custom React hooks for data fetching and state management
- **Utils**: Helper functions and utilities

### Backend (Node.js/Express)
- **Routes**: API endpoints in `server/routes.ts`
- **Storage**: Database abstraction layer in `server/storage.ts`
- **Auth**: Authentication logic in `server/simpleAuth.ts`
- **Schema**: Database schema definitions in `shared/schema.ts`

## 📝 Contribution Guidelines

### Code Style

- **TypeScript**: All new code must be in TypeScript
- **Formatting**: Use Prettier and ESLint (configs provided)
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Add JSDoc comments for public functions
- **Imports**: Use absolute imports with `@/` prefix for client code

### Commit Standards

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new authentication method
fix: resolve cap table calculation bug
docs: update API documentation
style: fix linting issues
refactor: simplify database queries
test: add unit tests for analytics
chore: update dependencies
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, tested code
   - Update documentation if needed
   - Follow existing patterns and conventions

3. **Test Your Changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Provide clear description of changes
   - Link related issues
   - Add screenshots for UI changes
   - Request review from maintainers

## 🎯 Contribution Areas

### 🔥 High Priority

- **Security Enhancements**: Authentication improvements, data validation
- **Performance**: Database query optimization, frontend bundle optimization
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: API docs, code comments, user guides

### 🚀 Feature Opportunities

- **Advanced Analytics**: More chart types, custom metrics, trend analysis
- **Notifications**: Email alerts, in-app notifications, webhook integrations
- **Export Features**: PDF reports, Excel exports, API endpoints
- **Mobile Experience**: Responsive design improvements, PWA features
- **Integrations**: Third-party services, accounting software, CRM systems

### 🐛 Bug Fixes

- Check [Issues](https://github.com/your-org/cynco-investor-relations/issues) for reported bugs
- Look for `good first issue` labels for beginner-friendly tasks
- Test edge cases and error handling

## 🧪 Testing Guidelines

### Writing Tests

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Test Structure

```typescript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test input';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 📚 Code Examples

### Adding a New API Endpoint

1. **Define Schema** (`shared/schema.ts`)
```typescript
export const newFeature = pgTable("new_feature", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

2. **Add Storage Method** (`server/storage.ts`)
```typescript
async getNewFeatures(): Promise<NewFeature[]> {
  return await db.select().from(newFeature);
}
```

3. **Create API Route** (`server/routes.ts`)
```typescript
app.get("/api/new-features", isAuthenticated, async (req, res) => {
  try {
    const features = await storage.getNewFeatures();
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch features" });
  }
});
```

4. **Add Frontend Hook** (`client/src/hooks/`)
```typescript
export function useNewFeatures() {
  return useQuery({
    queryKey: ["/api/new-features"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### Creating a New Component

```typescript
interface NewComponentProps {
  data: NewFeature[];
  onAction: (id: number) => void;
}

export function NewComponent({ data, onAction }: NewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {data.map((item) => (
          <div key={item.id} onClick={() => onAction(item.id)}>
            {item.name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

## 🔒 Security Considerations

- **Input Validation**: Always validate user input
- **SQL Injection**: Use parameterized queries
- **Authentication**: Check user permissions for all operations
- **Data Sanitization**: Sanitize output to prevent XSS
- **Environment Variables**: Never commit secrets to git

## 📖 Documentation Standards

- **README Updates**: Update main README for significant features
- **Code Comments**: Use JSDoc for functions and complex logic
- **API Documentation**: Document all endpoints with examples
- **Type Definitions**: Export and document public types

## 🎉 Recognition

Contributors will be:
- Listed in the README contributors section
- Mentioned in release notes for significant contributions
- Invited to join our contributor Discord/Slack
- Featured on social media for major features

## 🆘 Getting Help

- **Discord**: Join our contributor chat
- **Issues**: Create an issue for questions
- **Discussions**: Use GitHub Discussions for broader topics
- **Email**: Contact maintainers directly for sensitive issues

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions focused and professional

## 🎁 Rewards for Contributors

- **Swag**: Cynco stickers and merchandise for regular contributors
- **References**: LinkedIn recommendations for significant contributors
- **Beta Access**: Early access to new features and products
- **Networking**: Connections with startup ecosystem professionals

---

Thank you for contributing to making investor relations more transparent and accessible! 🚀