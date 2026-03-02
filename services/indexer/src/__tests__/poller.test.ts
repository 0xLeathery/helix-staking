import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ConfirmedSignatureInfo } from '@solana/web3.js';

import { fetchNewSignatures } from '../worker/poller.js';

// Mock logger
vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

function makeSig(sig: string, slot: number = 100): ConfirmedSignatureInfo {
  return {
    signature: sig,
    slot,
    err: null,
    memo: null,
    blockTime: null,
    confirmationStatus: 'confirmed',
  };
}

describe('fetchNewSignatures', () => {
  let mockRpc: { getSignaturesForAddress: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRpc = {
      getSignaturesForAddress: vi.fn(),
    };
  });

  // Valid Solana program IDs — use well-known addresses
  const PROGRAM_ID = '11111111111111111111111111111111'; // System program

  it('returns empty array when no new signatures found', async () => {
    mockRpc.getSignaturesForAddress.mockResolvedValue([]);

    const result = await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    expect(result).toEqual([]);
    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledTimes(1);
  });

  it('returns signatures in chronological order (oldest first)', async () => {
    const sigs = [
      makeSig('sig3', 300),
      makeSig('sig2', 200),
      makeSig('sig1', 100),
    ];
    mockRpc.getSignaturesForAddress.mockResolvedValue(sigs);

    const result = await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    // Should be reversed: oldest first
    expect(result[0].signature).toBe('sig1');
    expect(result[1].signature).toBe('sig2');
    expect(result[2].signature).toBe('sig3');
  });

  it('uses `until` option when checkpoint exists', async () => {
    mockRpc.getSignaturesForAddress.mockResolvedValue([makeSig('sig5', 500)]);

    await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: 'lastKnownSig' },
    );

    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ until: 'lastKnownSig' }),
    );
  });

  it('does not use `until` option when no checkpoint exists', async () => {
    mockRpc.getSignaturesForAddress.mockResolvedValue([]);

    await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    const callArgs = mockRpc.getSignaturesForAddress.mock.calls[0][1];
    expect(callArgs.until).toBeUndefined();
  });

  it('paginates when full page (1000 sigs) is returned', async () => {
    // First call returns 1000 sigs (PAGE_SIZE), second returns fewer
    const firstBatch = Array.from({ length: 1000 }, (_, i) =>
      makeSig(`sigA${String(i).padStart(5, '0')}`, 1000 - i),
    );
    const secondBatch = [makeSig('sigBatch2', 5)];

    mockRpc.getSignaturesForAddress
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    const result = await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledTimes(2);
    // Second call should use `before` with the oldest sig from first batch
    const secondCallOptions = mockRpc.getSignaturesForAddress.mock.calls[1][1];
    expect(secondCallOptions.before).toBe('sigA00999');
    expect(result).toHaveLength(1001);
  });

  it('stops paginating when partial page returned', async () => {
    const partialBatch = [makeSig('sig1', 100), makeSig('sig2', 200)];
    mockRpc.getSignaturesForAddress.mockResolvedValue(partialBatch);

    await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    // Only one call since batch is smaller than PAGE_SIZE
    expect(mockRpc.getSignaturesForAddress).toHaveBeenCalledTimes(1);
  });

  it('returns total count of signatures across all pages', async () => {
    const firstBatch = Array.from({ length: 1000 }, (_, i) =>
      makeSig(`batch1X${i}`, 2000 - i),
    );
    const secondBatch = Array.from({ length: 500 }, (_, i) =>
      makeSig(`batch2X${i}`, 1000 - i),
    );

    mockRpc.getSignaturesForAddress
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    const result = await fetchNewSignatures(
      mockRpc as any,
      PROGRAM_ID,
      { lastSignature: null },
    );

    expect(result).toHaveLength(1500);
  });
});
