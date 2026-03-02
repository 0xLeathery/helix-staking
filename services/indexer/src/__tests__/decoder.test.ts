import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the anchor lib to avoid IDL file dependency
vi.mock('../lib/anchor.js', () => ({
  parseEventsFromLogs: vi.fn(),
}));

// Mock logger
vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { decodeEventsFromSignature } from '../worker/decoder.js';
import { parseEventsFromLogs } from '../lib/anchor.js';

describe('decodeEventsFromSignature', () => {
  let mockRpc: { getParsedTransaction: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRpc = {
      getParsedTransaction: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('returns empty array when transaction is not found (pruned)', async () => {
    mockRpc.getParsedTransaction.mockResolvedValue(null);

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig1');

    expect(result).toEqual([]);
  });

  it('returns empty array when transaction has no log messages', async () => {
    mockRpc.getParsedTransaction.mockResolvedValue({
      slot: 500,
      meta: { logMessages: [] },
    });

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig2');

    expect(result).toEqual([]);
  });

  it('returns empty array when transaction meta is null', async () => {
    mockRpc.getParsedTransaction.mockResolvedValue({
      slot: 500,
      meta: null,
    });

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig3');

    expect(result).toEqual([]);
  });

  it('decodes events from valid transaction log messages', async () => {
    vi.mocked(parseEventsFromLogs).mockReturnValue([
      { name: 'StakeCreated', data: { user: 'wallet1', stakeId: 1, amount: '1000' } },
    ]);

    mockRpc.getParsedTransaction.mockResolvedValue({
      slot: 1000,
      meta: {
        logMessages: [
          'Program log: AnchorEventData:...',
        ],
      },
    });

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig4');

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'StakeCreated',
      data: { user: 'wallet1', stakeId: 1, amount: '1000' },
      slot: 1000,
    });
  });

  it('decodes multiple events from a single transaction', async () => {
    vi.mocked(parseEventsFromLogs).mockReturnValue([
      { name: 'InflationDistributed', data: { day: 5 } },
      { name: 'RewardsClaimed', data: { user: 'w1', amount: '500' } },
    ]);

    mockRpc.getParsedTransaction.mockResolvedValue({
      slot: 2000,
      meta: { logMessages: ['log1', 'log2'] },
    });

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig5');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('InflationDistributed');
    expect(result[1].name).toBe('RewardsClaimed');
    // Both events should use the same slot
    expect(result[0].slot).toBe(2000);
    expect(result[1].slot).toBe(2000);
  });

  it('returns empty array when parseEventsFromLogs throws (malformed data)', async () => {
    vi.mocked(parseEventsFromLogs).mockImplementation(() => {
      throw new Error('Invalid base64 encoding');
    });

    mockRpc.getParsedTransaction.mockResolvedValue({
      slot: 3000,
      meta: { logMessages: ['Program log: malformed'] },
    });

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig6');

    // Should not throw, should return empty array
    expect(result).toEqual([]);
  });

  it('returns empty array when RPC call throws', async () => {
    mockRpc.getParsedTransaction.mockRejectedValue(
      new Error('RPC connection refused'),
    );

    const result = await decodeEventsFromSignature(mockRpc as any, 'sig7');

    expect(result).toEqual([]);
  });
});
