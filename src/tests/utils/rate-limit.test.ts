import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit } from '@/utils/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within the limit', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 3 });
    expect(limiter('user-1')).toBe(false);
    expect(limiter('user-1')).toBe(false);
    expect(limiter('user-1')).toBe(false);
  });

  it('blocks requests exceeding the limit', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 2 });
    expect(limiter('user-2')).toBe(false);
    expect(limiter('user-2')).toBe(false);
    expect(limiter('user-2')).toBe(true);
  });

  it('resets after the interval', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    expect(limiter('user-3')).toBe(false);
    expect(limiter('user-3')).toBe(true);

    vi.advanceTimersByTime(60_001);

    expect(limiter('user-3')).toBe(false);
  });

  it('tracks different keys independently', () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    expect(limiter('user-a')).toBe(false);
    expect(limiter('user-b')).toBe(false);
    expect(limiter('user-a')).toBe(true);
    expect(limiter('user-b')).toBe(true);
  });
});
