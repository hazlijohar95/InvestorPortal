import { z } from 'zod';

// Security-focused validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(254, 'Email too long')
  .transform(email => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .refine(
    password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password),
    'Password must contain uppercase, lowercase, number, and special character'
  );

export const idSchema = z
  .union([z.string(), z.number()])
  .transform(val => String(val))
  .refine(val => /^[a-zA-Z0-9-_]+$/.test(val), 'Invalid ID format');

export const textSchema = z
  .string()
  .max(1000, 'Text too long')
  .transform(text => text.trim());

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL too long');

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>'"&]/g, char => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    });
}

export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 255);
}

// SQL injection prevention helpers
export function isValidOrderBy(field: string, allowedFields: string[]): boolean {
  return allowedFields.includes(field) && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field);
}

export function validatePagination(page: unknown, limit: unknown) {
  const pageSchema = z.coerce.number().int().min(1).max(1000);
  const limitSchema = z.coerce.number().int().min(1).max(100);
  
  return {
    page: pageSchema.parse(page),
    limit: limitSchema.parse(limit)
  };
}

// Rate limiting helpers
export class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Global rate limiters
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes