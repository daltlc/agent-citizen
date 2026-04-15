import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let warned = false;

function isConfigured() {
  return (
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

const limiterCache = new Map<string, Ratelimit>();

function getLimiter(preset: RateLimitPreset): Ratelimit | null {
  if (!isConfigured()) return null;

  if (limiterCache.has(preset)) return limiterCache.get(preset)!;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const configs: Record<RateLimitPreset, Ratelimit> = {
    api: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "rl:api",
    }),
    apiWrite: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "rl:apiWrite",
    }),
    action: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      prefix: "rl:action",
    }),
    auth: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "5 m"),
      prefix: "rl:auth",
    }),
  };

  for (const [key, val] of Object.entries(configs)) {
    limiterCache.set(key, val);
  }

  return configs[preset];
}

export type RateLimitPreset = "api" | "apiWrite" | "action" | "auth";

/**
 * Check rate limit for a given identifier and preset.
 * Returns { success, remaining, reset } or allows all requests
 * if Upstash is not configured (local dev / CI).
 */
export async function rateLimit(
  identifier: string,
  preset: RateLimitPreset
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const limiter = getLimiter(preset);

  if (!limiter) {
    if (!warned) {
      warned = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. Rate limiting disabled."
      );
    }
    return { success: true, remaining: 999, reset: 0 };
  }

  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Rate limit helper for server actions.
 * Returns an error string if rate limited, or null if allowed.
 */
export async function rateLimitAction(
  citizenId: string,
  preset: RateLimitPreset = "action"
): Promise<string | null> {
  const result = await rateLimit(citizenId, preset);
  if (!result.success) {
    return "Too many requests. Please wait a moment and try again.";
  }
  return null;
}

/**
 * Extract client IP from request headers (Vercel sets x-forwarded-for).
 */
export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
