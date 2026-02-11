import { NextResponse } from "next/server";

/**
 * Phase 8.1 (M6/FR-011): RPC proxy with method whitelist and per-IP rate limit.
 *
 * - Only allows a strict set of Solana JSON-RPC methods through the proxy
 * - Rejects everything else with 403
 * - Simple per-IP rate limit (60 req/min) using in-memory counters
 */

// Only allow methods the frontend legitimately needs
const ALLOWED_METHODS = new Set([
  "getAccountInfo",
  "getBalance",
  "getLatestBlockhash",
  "getMultipleAccounts",
  "getProgramAccounts",
  "getSignaturesForAddress",
  "getSlot",
  "getTokenAccountBalance",
  "getTransaction",
  "sendTransaction",
  "simulateTransaction",
]);

// Simple per-IP rate limiting
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

// Periodic cleanup (runs every 5 minutes)
if (typeof globalThis !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    const keys = Array.from(rateBuckets.keys());
    for (const ip of keys) {
      const bucket = rateBuckets.get(ip);
      if (bucket && bucket.resetAt <= now) rateBuckets.delete(ip);
    }
  }, 5 * 60_000);
  // Don't block process exit in Node.js
  if (typeof interval === "object" && "unref" in interval) {
    (interval as NodeJS.Timeout).unref();
  }
}

function getClientIp(request: Request): string {
  // Next.js provides x-forwarded-for from the edge
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateBuckets.set(ip, bucket);
    return true;
  }

  bucket.count++;
  return bucket.count <= RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const rpcUrl = process.env.HELIUS_RPC_URL;

  if (!rpcUrl) {
    return NextResponse.json(
      { error: "RPC endpoint not configured" },
      { status: 500 }
    );
  }

  // Rate limit check
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests", message: "Rate limit exceeded (60 req/min)" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Method whitelist check
    const method = body?.method;
    if (!method || !ALLOWED_METHODS.has(method)) {
      return NextResponse.json(
        { error: "Method not allowed", method },
        { status: 403 }
      );
    }

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "RPC request failed" },
      { status: 500 }
    );
  }
}
