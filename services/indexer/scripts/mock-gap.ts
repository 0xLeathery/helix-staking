#!/usr/bin/env tsx
/**
 * Phase 8.1 (SC-002): Mock chain gap simulation.
 *
 * Validates that the indexer's backward pagination correctly handles gaps
 * of >5000 signatures between the checkpoint and the chain tip.
 *
 * This script:
 * 1. Creates a mock RPC that returns signatures in batches of 1000
 * 2. Simulates a gap of N signatures (default: 5500)
 * 3. Calls fetchNewSignatures and verifies ALL signatures are returned
 * 4. Verifies chronological ordering (oldest first)
 *
 * Usage:
 *   npx tsx scripts/mock-gap.ts [gap-size]
 *   npx tsx scripts/mock-gap.ts 5500
 */

import { type ConfirmedSignatureInfo } from '@solana/web3.js';

// Dynamically import the poller to test
const POLLER_PATH = '../src/worker/poller.js';

// ---- Mock RPC ----

interface MockSignature {
  signature: string;
  slot: number;
  blockTime: number;
}

function generateSignatures(count: number): MockSignature[] {
  const sigs: MockSignature[] = [];
  for (let i = 0; i < count; i++) {
    sigs.push({
      signature: `sig_${String(i).padStart(6, '0')}`,
      slot: 100_000 + i,
      blockTime: Math.floor(Date.now() / 1000) - count + i,
    });
  }
  // Return in reverse chronological order (newest first), matching Solana RPC behavior
  return sigs.reverse();
}

function createMockRpc(allSignatures: MockSignature[]) {
  let callCount = 0;

  return {
    getSignaturesForAddress: async (
      _programId: any,
      options: { limit?: number; until?: string; before?: string },
    ): Promise<ConfirmedSignatureInfo[]> => {
      callCount++;
      const limit = options.limit ?? 1000;

      // Filter by `until` (only sigs NEWER than this)
      let filtered = [...allSignatures];
      if (options.until) {
        const untilIdx = filtered.findIndex((s) => s.signature === options.until);
        if (untilIdx >= 0) {
          // Only return sigs that are newer (appear BEFORE the `until` sig in the array)
          filtered = filtered.slice(0, untilIdx);
        }
      }

      // Filter by `before` (only sigs OLDER than this)
      if (options.before) {
        const beforeIdx = filtered.findIndex((s) => s.signature === options.before);
        if (beforeIdx >= 0) {
          // Only return sigs that are older (appear AFTER the `before` sig in the array)
          filtered = filtered.slice(beforeIdx + 1);
        }
      }

      // Apply limit
      const result = filtered.slice(0, limit);

      console.log(
        `  RPC call #${callCount}: limit=${limit}, until=${options.until ?? 'none'}, ` +
          `before=${options.before ?? 'none'} → returned ${result.length} sigs`,
      );

      return result as unknown as ConfirmedSignatureInfo[];
    },

    getCallCount: () => callCount,
  };
}

// ---- Main ----

async function main() {
  const gapSize = parseInt(process.argv[2] ?? '5500', 10);
  console.log(`\n=== Mock Chain Gap Simulation ===`);
  console.log(`Gap size: ${gapSize} signatures\n`);

  if (gapSize < 1) {
    console.error('Gap size must be >= 1');
    process.exit(1);
  }

  // Generate mock data
  const allSigs = generateSignatures(gapSize);
  const checkpointSig = null; // No checkpoint = fresh start

  console.log(`Generated ${allSigs.length} mock signatures (newest-first)`);
  console.log(`Checkpoint: ${checkpointSig ?? 'none (fresh start)'}\n`);

  // Import the poller
  const { fetchNewSignatures } = await import(POLLER_PATH);

  // Create mock RPC
  const mockRpc = createMockRpc(allSigs);

  // Run the paginated fetch
  console.log('--- Fetching signatures ---');
  const result = await fetchNewSignatures(
    mockRpc,
    'MockProgramId111111111111111111111111111111',
    { lastSignature: checkpointSig },
  );

  console.log(`\n--- Results ---`);
  console.log(`Total fetched: ${result.length}`);
  console.log(`RPC calls made: ${mockRpc.getCallCount()}`);
  console.log(`Expected calls: ${Math.ceil(gapSize / 1000)}`);

  // Validate ALL signatures were returned
  if (result.length !== gapSize) {
    console.error(`\n✗ FAIL: Expected ${gapSize} signatures, got ${result.length}`);
    process.exit(1);
  }
  console.log(`✓ All ${gapSize} signatures fetched`);

  // Validate chronological ordering (oldest first)
  const firstSig = result[0].signature as string;
  const lastSig = result[result.length - 1].signature as string;

  // sig_000000 should be first (oldest), sig_005499 last (newest)
  const firstNum = parseInt(firstSig.split('_')[1], 10);
  const lastNum = parseInt(lastSig.split('_')[1], 10);

  if (firstNum >= lastNum) {
    console.error(`\n✗ FAIL: Not in chronological order. First: ${firstSig}, Last: ${lastSig}`);
    process.exit(1);
  }
  console.log(`✓ Chronological order verified (first: ${firstSig}, last: ${lastSig})`);

  // Test with checkpoint (simulate partial gap)
  console.log(`\n--- Testing with checkpoint ---`);
  const checkpointAt = `sig_${String(Math.floor(gapSize / 2)).padStart(6, '0')}`;
  const expectedAfterCheckpoint = Math.floor(gapSize / 2);
  console.log(`Checkpoint at: ${checkpointAt} (expecting ~${expectedAfterCheckpoint} sigs)\n`);

  const mockRpc2 = createMockRpc(allSigs);
  const result2 = await fetchNewSignatures(
    mockRpc2,
    'MockProgramId111111111111111111111111111111',
    { lastSignature: checkpointAt },
  );

  console.log(`\nFetched: ${result2.length}`);
  if (result2.length !== expectedAfterCheckpoint) {
    console.error(
      `\n✗ FAIL: Expected ${expectedAfterCheckpoint} signatures after checkpoint, got ${result2.length}`,
    );
    process.exit(1);
  }
  console.log(`✓ Correct count after checkpoint: ${result2.length}`);

  console.log(`\n=== ALL TESTS PASSED ===\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
