import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock db client before importing checkpoint module
vi.mock('../db/client.js', () => {
  return {
    db: {
      select: vi.fn(),
      insert: vi.fn(),
    },
  };
});

import { getCheckpoint, updateCheckpoint } from '../worker/checkpoint.js';
import { db } from '../db/client.js';

describe('getCheckpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null values when no checkpoint exists (first run)', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    } as any);

    const result = await getCheckpoint('ProgId11111111111111111111111111111111111111');

    expect(result).toEqual({ lastSignature: null, lastSlot: null });
  });

  it('returns checkpoint data when row exists', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            { lastSignature: 'sig123', lastSlot: 5000 },
          ]),
        }),
      }),
    } as any);

    const result = await getCheckpoint('ProgId11111111111111111111111111111111111111');

    expect(result).toEqual({ lastSignature: 'sig123', lastSlot: 5000 });
  });

  it('returns only the first row when multiple checkpoints exist', async () => {
    vi.mocked(db.select).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            { lastSignature: 'sig-latest', lastSlot: 9999 },
            { lastSignature: 'sig-old', lastSlot: 1000 },
          ]),
        }),
      }),
    } as any);

    const result = await getCheckpoint('ProgId11111111111111111111111111111111111111');

    expect(result.lastSignature).toBe('sig-latest');
    expect(result.lastSlot).toBe(9999);
  });
});

describe('updateCheckpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('upserts checkpoint with signature and slot', async () => {
    const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
    const values = vi.fn().mockReturnValue({ onConflictDoUpdate });
    vi.mocked(db.insert).mockReturnValue({ values } as any);

    await updateCheckpoint(
      'ProgId11111111111111111111111111111111111111',
      'newSig456',
      7500,
    );

    expect(db.insert).toHaveBeenCalled();
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        programId: 'ProgId11111111111111111111111111111111111111',
        lastSignature: 'newSig456',
        lastSlot: 7500,
        processedCount: 1,
      }),
    );
    expect(onConflictDoUpdate).toHaveBeenCalled();
  });

  it('accepts a custom dbClient for transactional writes', async () => {
    const mockDbClient = {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
        }),
      }),
    };

    await updateCheckpoint(
      'ProgId11111111111111111111111111111111111111',
      'txSig789',
      8000,
      mockDbClient as any,
    );

    expect(mockDbClient.insert).toHaveBeenCalled();
    // Default db should NOT be called when custom client provided
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('includes updatedAt in the upsert values', async () => {
    const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
    const values = vi.fn().mockReturnValue({ onConflictDoUpdate });
    vi.mocked(db.insert).mockReturnValue({ values } as any);

    await updateCheckpoint(
      'ProgId11111111111111111111111111111111111111',
      'sigTime',
      1000,
    );

    const callArgs = values.mock.calls[0][0];
    expect(callArgs.updatedAt).toBeInstanceOf(Date);
  });
});
