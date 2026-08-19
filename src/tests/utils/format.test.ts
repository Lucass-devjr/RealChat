import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getInitials, truncate, formatMessageTime } from '@/utils/format';

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns single initial from single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('limits to 2 characters', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('uppercases initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});

describe('truncate', () => {
  it('returns original string if within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates long strings with ellipsis', () => {
    expect(truncate('Hello, World!', 5)).toBe('Hello...');
  });

  it('returns original when exactly at limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

describe('formatMessageTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T14:30:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats today as HH:mm', () => {
    const result = formatMessageTime('2024-06-15T10:30:00');
    expect(result).toBe('10:30');
  });

  it('formats yesterday as Ontem', () => {
    const result = formatMessageTime('2024-06-14T10:30:00');
    expect(result).toBe('Ontem');
  });

  it('formats older dates as dd/MM/yyyy', () => {
    const result = formatMessageTime('2024-01-15T12:00:00');
    expect(result).toBe('15/01/2024');
  });
});
