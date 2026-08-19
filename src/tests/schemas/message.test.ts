import { describe, it, expect } from 'vitest';
import { sendMessageSchema, editMessageSchema } from '@/schemas/message';

describe('sendMessageSchema', () => {
  it('validates correct message data', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Hello, world!',
    });
    expect(result.success).toBe(true);
  });

  it('applies default type TEXT', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Hello',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('TEXT');
    }
  });

  it('rejects empty content', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      content: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects content over 5000 chars', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      content: 'a'.repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid conversation ID', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: 'not-a-uuid',
      content: 'Hello',
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional replyToId', () => {
    const result = sendMessageSchema.safeParse({
      conversationId: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Reply!',
      replyToId: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });
});

describe('editMessageSchema', () => {
  it('validates correct edit data', () => {
    const result = editMessageSchema.safeParse({ content: 'Edited message' });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = editMessageSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
  });
});
