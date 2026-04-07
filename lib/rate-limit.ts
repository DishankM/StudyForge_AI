type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

type RateLimitOptions = {
  bucket: string;
  key: string;
  limit: number;
  windowMs: number;
};

type MemoryEntry = {
  count: number;
  expiresAt: number;
};

const memoryStore = globalThis.__studyForgeRateLimitStore ?? new Map<string, MemoryEntry>();

if (!globalThis.__studyForgeRateLimitStore) {
  globalThis.__studyForgeRateLimitStore = memoryStore;
}

declare global {
  var __studyForgeRateLimitStore: Map<string, MemoryEntry> | undefined;
  var __studyForgeRedisClient: any;
}

function getScopedKey(bucket: string, key: string) {
  return `ratelimit:${bucket}:${key}`;
}

function getRetryAfter(expiresAt: number) {
  return Math.max(1, Math.ceil((expiresAt - Date.now()) / 1000));
}

async function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (globalThis.__studyForgeRedisClient) {
    return globalThis.__studyForgeRedisClient;
  }

  try {
    const { default: Redis } = await import("ioredis");
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    client.on("error", () => {
      // Fall back to in-memory limiting if Redis is unavailable.
    });

    await client.connect();
    globalThis.__studyForgeRedisClient = client;
    return client;
  } catch {
    return null;
  }
}

async function consumeWithMemory({
  bucket,
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const scopedKey = getScopedKey(bucket, key);
  const now = Date.now();
  const current = memoryStore.get(scopedKey);

  if (!current || current.expiresAt <= now) {
    memoryStore.set(scopedKey, {
      count: 1,
      expiresAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      retryAfter: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  memoryStore.set(scopedKey, current);

  const allowed = current.count <= limit;
  return {
    allowed,
    remaining: Math.max(0, limit - current.count),
    retryAfter: getRetryAfter(current.expiresAt),
  };
}

async function consumeWithRedis({
  bucket,
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult | null> {
  const client = await getRedisClient();
  if (!client) {
    return null;
  }

  const scopedKey = getScopedKey(bucket, key);

  try {
    const count = await client.incr(scopedKey);
    if (count === 1) {
      await client.pexpire(scopedKey, windowMs);
    }

    const ttlMs = await client.pttl(scopedKey);
    const retryAfter = Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : windowMs) / 1000));

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      retryAfter,
    };
  } catch {
    return null;
  }
}

export async function consumeRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const redisResult = await consumeWithRedis(options);
  if (redisResult) {
    return redisResult;
  }

  return consumeWithMemory(options);
}

export function getClientIp(input: Headers | Request | null | undefined) {
  const headers =
    input instanceof Request ? input.headers : input instanceof Headers ? input : undefined;

  const forwardedFor = headers?.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headers?.get("x-real-ip") || "unknown";
}

export function normalizeRateLimitKey(value: string) {
  return value.trim().toLowerCase();
}
