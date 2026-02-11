#!/usr/bin/env tsx
/**
 * Phase 8.1 (SC-004/T037): Indexer API load test.
 *
 * Fires 100+ concurrent requests per second at the indexer API and verifies
 * that the rate limiter produces <1% error rate for legitimate traffic.
 *
 * Usage:
 *   npx tsx scripts/load-test.ts [base-url] [rps] [duration-sec]
 *   npx tsx scripts/load-test.ts http://localhost:3001 120 10
 *
 * Defaults: http://localhost:3001, 120 req/s, 10 seconds
 */

const BASE_URL = process.argv[2] ?? "http://localhost:3001";
const TARGET_RPS = parseInt(process.argv[3] ?? "120", 10);
const DURATION_SEC = parseInt(process.argv[4] ?? "10", 10);

// Endpoints to hit (weighted towards the bounded one)
const ENDPOINTS = [
  { path: "/health", weight: 2 },
  { path: "/api/stats", weight: 3 },
  { path: "/api/stats/history?limit=20", weight: 5 },
];

interface Result {
  status: number;
  latencyMs: number;
  endpoint: string;
}

function pickEndpoint(): string {
  const totalWeight = ENDPOINTS.reduce((sum, e) => sum + e.weight, 0);
  let r = Math.random() * totalWeight;
  for (const ep of ENDPOINTS) {
    r -= ep.weight;
    if (r <= 0) return ep.path;
  }
  return ENDPOINTS[0].path;
}

async function fireRequest(): Promise<Result> {
  const endpoint = pickEndpoint();
  const url = `${BASE_URL}${endpoint}`;
  const start = performance.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5_000),
    });
    return {
      status: res.status,
      latencyMs: performance.now() - start,
      endpoint,
    };
  } catch {
    return {
      status: 0, // network error
      latencyMs: performance.now() - start,
      endpoint,
    };
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  console.log(`\n=== Indexer API Load Test ===`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Rate: ${TARGET_RPS} req/s for ${DURATION_SEC}s`);
  console.log(`Total requests: ~${TARGET_RPS * DURATION_SEC}\n`);

  const results: Result[] = [];
  const intervalMs = 1000 / TARGET_RPS;
  const totalRequests = TARGET_RPS * DURATION_SEC;

  const startTime = performance.now();

  // Fire requests at the target rate
  const promises: Promise<void>[] = [];
  for (let i = 0; i < totalRequests; i++) {
    promises.push(
      fireRequest().then((r) => {
        results.push(r);
      }),
    );

    // Pace requests
    if (i < totalRequests - 1) {
      await sleep(intervalMs);
    }
  }

  // Wait for all in-flight requests to complete
  await Promise.allSettled(promises);

  const elapsed = (performance.now() - startTime) / 1000;

  // Analyze results
  const ok = results.filter((r) => r.status >= 200 && r.status < 300).length;
  const rateLimited = results.filter((r) => r.status === 429).length;
  const errors = results.filter(
    (r) => r.status === 0 || (r.status >= 500 && r.status < 600),
  ).length;

  const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] ?? 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] ?? 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] ?? 0;

  const errorRate = (errors / results.length) * 100;
  const actualRps = results.length / elapsed;

  console.log(`--- Results ---`);
  console.log(`Duration:       ${elapsed.toFixed(1)}s`);
  console.log(`Total requests: ${results.length}`);
  console.log(`Actual RPS:     ${actualRps.toFixed(1)}`);
  console.log(`  2xx OK:       ${ok}`);
  console.log(`  429 Limited:  ${rateLimited}`);
  console.log(`  5xx/Error:    ${errors}`);
  console.log(`Error rate:     ${errorRate.toFixed(2)}% (target: <1%)`);
  console.log(`Latency p50:    ${p50.toFixed(1)}ms`);
  console.log(`Latency p95:    ${p95.toFixed(1)}ms`);
  console.log(`Latency p99:    ${p99.toFixed(1)}ms`);

  // 429s are expected and correct — they prove rate limiting works
  // Only count real errors (5xx, timeouts) towards the error rate
  if (errorRate > 1.0) {
    console.log(`\n✗ FAIL: Error rate ${errorRate.toFixed(2)}% exceeds 1% threshold`);
    process.exit(1);
  }

  if (rateLimited === 0 && TARGET_RPS > 100) {
    console.log(`\n⚠ WARNING: No 429 responses at ${TARGET_RPS} RPS — rate limiter may not be active`);
  } else if (rateLimited > 0) {
    console.log(`\n✓ Rate limiter active: ${rateLimited} requests correctly throttled`);
  }

  console.log(`✓ PASS: Error rate ${errorRate.toFixed(2)}% within tolerance\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
