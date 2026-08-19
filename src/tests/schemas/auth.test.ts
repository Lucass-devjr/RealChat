import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/schemas/auth';

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('validates correct register data', () => {
    const result = registerSchema.safeParse({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      fullName: 'J',
      email: 'john@example.com',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const result = registerSchema.safeParse({
      email: 'john@example.com',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });
});
