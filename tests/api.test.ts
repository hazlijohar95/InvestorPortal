import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../server/routes';

describe('API Integration Tests', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('Authentication', () => {
    it('should return 401 for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .expect(401);

      expect(response.body).toEqual({ message: 'Unauthorized' });
    });

    it('should accept valid login credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'hello@cynco.io',
          password: 'admin123123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('hello@cynco.io');
    });

    it('should reject invalid login credentials', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'wrong@email.com',
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('Metrics API', () => {
    let authCookie: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'hello@cynco.io',
          password: 'admin123123'
        });
      
      authCookie = loginResponse.headers['set-cookie'];
    });

    it('should return metrics for authenticated users', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body).toHaveProperty('revenue');
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('growth');
    });

    it('should allow admins to update metrics', async () => {
      const updateData = {
        revenue: 150000,
        users: 1500,
        growth: 20,
        burn: 30000,
        runway: 24
      };

      const response = await request(app)
        .put('/api/metrics')
        .set('Cookie', authCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.revenue).toBe(150000);
      expect(response.body.users).toBe(1500);
    });
  });

  describe('Stakeholders API', () => {
    let authCookie: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'hello@cynco.io',
          password: 'admin123123'
        });
      
      authCookie = loginResponse.headers['set-cookie'];
    });

    it('should return stakeholders list', async () => {
      const response = await request(app)
        .get('/api/stakeholders')
        .set('Cookie', authCookie)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create new stakeholder', async () => {
      const stakeholderData = {
        name: 'Test Investor',
        email: 'test@investor.com',
        type: 'investor',
        shares: 10000,
        percentage: 2.5,
        investmentAmount: 100000
      };

      const response = await request(app)
        .post('/api/stakeholders')
        .set('Cookie', authCookie)
        .send(stakeholderData)
        .expect(201);

      expect(response.body.name).toBe('Test Investor');
      expect(response.body.email).toBe('test@investor.com');
    });

    it('should validate stakeholder data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: malformed email
        type: 'invalid-type' // Invalid: not in enum
      };

      await request(app)
        .post('/api/stakeholders')
        .set('Cookie', authCookie)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      // This test would need to be adjusted based on actual rate limit settings
      const promises = Array.from({ length: 105 }, () => 
        request(app).get('/health')
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});