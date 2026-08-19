import { describe, it, expect } from 'vitest';
import { addContactSchema } from '@/schemas/contact';

describe('addContactSchema', () => {
  it('validates correct email', () => {
    const result = addContactSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = addContactSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects empty email', () => {
    const result = addContactSchema.safeParse({ email: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = addContactSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
