import { beforeAll, afterAll, afterEach } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.SESSION_SECRET = 'test-session-secret';

// Global test setup
beforeAll(async () => {
  // Database setup for testing
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Cleanup after all tests
  console.log('Cleaning up test environment...');
});

afterEach(() => {
  // Clean up after each test
  jest.clearAllMocks();
});