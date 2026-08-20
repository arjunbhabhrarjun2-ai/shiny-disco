// src/lib/rateLimiter.ts
//
// A lightweight, dependency-free fixed-window rate limiter that actually works
// in the Next.js App Router / middleware (the previous express-rate-limit based
// module was dead code — it expected Express req/res that never exist here).
//
// This uses an in-memory Map, which limits per server instance. For multi-
// instance / serverless deployments, back it with Redis (e.g. Upstash) using
// the same interface. See SECURITY_REMEDIATION.md.

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Opportunistic cleanup so the map doesn't grow unbounded.
function sweep(now: number) {
  if (store.size < 5000) return;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max requests allowed per window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
}

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, max: 10 },
  withdrawal: { windowMs: 60 * 60 * 1000, max: 5 },
  transaction: { windowMs: 15 * 60 * 1000, max: 20 },
  api: { windowMs: 15 * 60 * 1000, max: 100 },
} as const;

/**
 * Record a hit for `identifier` (e.g. "auth:1.2.3.4") and report whether it is
 * within the configured limit.
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = store.get(identifier);
  if (!existing || existing.resetAt <= now) {
    store.set(identifier, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.max - 1,
      limit: config.max,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  existing.count += 1;
  const allowed = existing.count <= config.max;
  return {
    allowed,
    remaining: Math.max(0, config.max - existing.count),
    limit: config.max,
    retryAfterSeconds: Math.max(0, Math.ceil((existing.resetAt - now) / 1000)),
  };
}

/** Best-effort client IP from common proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
