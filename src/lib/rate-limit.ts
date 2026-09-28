import { createHash } from "crypto";

type Bucket = { timestamps: number[] };

const memoryStore = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

function prune(bucket: Bucket, now: number) {
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < WINDOW_MS);
}

async function rateLimitUpstash(
  key: string,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redisKey = `rl:waitlist:${key}`;
  const now = Date.now();

  try {
    const pipe = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["ZREMRANGEBYSCORE", redisKey, 0, now - WINDOW_MS],
        ["ZADD", redisKey, now, `${now}-${Math.random()}`],
        ["ZCARD", redisKey],
        ["PEXPIRE", redisKey, WINDOW_MS],
      ]),
    });

    if (!pipe.ok) return null;
    const results = (await pipe.json()) as { result: number }[];
    const count = Number(results[2]?.result ?? 0);
    const allowed = count <= MAX_REQUESTS;
    return {
      allowed,
      remaining: Math.max(0, MAX_REQUESTS - count),
      retryAfterSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  } catch {
    return null;
  }
}

function rateLimitMemory(key: string): RateLimitResult {
  const now = Date.now();
  let bucket = memoryStore.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    memoryStore.set(key, bucket);
  }
  prune(bucket, now);
  if (bucket.timestamps.length >= MAX_REQUESTS) {
    const oldest = bucket.timestamps[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000),
    };
  }
  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: MAX_REQUESTS - bucket.timestamps.length,
    retryAfterSeconds: 0,
  };
}

export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const upstash = await rateLimitUpstash(key);
  if (upstash) return upstash;
  return rateLimitMemory(key);
}
