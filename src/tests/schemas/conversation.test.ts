import { describe, it, expect } from 'vitest';
import { createGroupSchema, createDirectSchema } from '@/schemas/conversation';

describe('createGroupSchema', () => {
  it('validates correct group data', () => {
    const result = createGroupSchema.safeParse({
      name: 'Dev Team',
      memberIds: ['550e8400-e29b-41d4-a716-446655440000'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = createGroupSchema.safeParse({
      name: 'A',
      memberIds: ['550e8400-e29b-41d4-a716-446655440000'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects name over 50 chars', () => {
    const result = createGroupSchema.safeParse({
      name: 'a'.repeat(51),
      memberIds: ['550e8400-e29b-41d4-a716-446655440000'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty member list', () => {
    const result = createGroupSchema.safeParse({
      name: 'Dev Team',
      memberIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid member UUIDs', () => {
    const result = createGroupSchema.safeParse({
      name: 'Dev Team',
      memberIds: ['not-a-uuid'],
    });
    expect(result.success).toBe(false);
  });
});

describe('createDirectSchema', () => {
  it('validates correct direct data', () => {
    const result = createDirectSchema.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUID', () => {
    const result = createDirectSchema.safeParse({ userId: 'invalid' });
    expect(result.success).toBe(false);
  });
});
