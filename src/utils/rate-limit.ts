const rateMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  interval: number;
  limit: number;
}

export function rateLimit(config: RateLimitConfig): (key: string) => boolean {
  return (key: string): boolean => {
    const now = Date.now();

    rateMap.forEach((value, mapKey) => {
      if (value.resetAt < now) rateMap.delete(mapKey);
    });

    const entry = rateMap.get(key);

    if (!entry || entry.resetAt < now) {
      rateMap.set(key, { count: 1, resetAt: now + config.interval });
      return false;
    }

    if (entry.count >= config.limit) {
      return true;
    }

    entry.count++;
    return false;
  };
}
