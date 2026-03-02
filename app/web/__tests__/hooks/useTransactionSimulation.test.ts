import { describe, it, expect, vi } from 'vitest';
import { SimulationError, simulateTransactionOrThrow, getSimulationErrorMessage } from '@/lib/hooks/useTransactionSimulation';

// Create a minimal mock connection
function mockConnection(simulateResult: { value: { err: unknown; logs: string[] | null } }) {
  return {
    simulateTransaction: vi.fn().mockResolvedValue(simulateResult),
  };
}

describe('simulateTransactionOrThrow', () => {
  it('resolves without error on successful simulation', async () => {
    const connection = mockConnection({ value: { err: null, logs: [] } });
    const tx = {} as import('@solana/web3.js').Transaction;
    await expect(simulateTransactionOrThrow(connection as never, tx)).resolves.toBeUndefined();
  });

  it('throws SimulationError when simulation.value.err is set', async () => {
    const connection = mockConnection({
      value: { err: { InstructionError: [0, { Custom: 6000 }] }, logs: [] },
    });
    const tx = {} as import('@solana/web3.js').Transaction;
    await expect(simulateTransactionOrThrow(connection as never, tx)).rejects.toThrow(SimulationError);
  });

  it('extracts Anchor error name from logs', async () => {
    const connection = mockConnection({
      value: {
        err: { InstructionError: [0, { Custom: 6000 }] },
        logs: [
          'Program log: AnchorError thrown ... Error Name: Unauthorized.',
          'Program helix-staking failed',
        ],
      },
    });
    const tx = {} as import('@solana/web3.js').Transaction;
    try {
      await simulateTransactionOrThrow(connection as never, tx);
    } catch (e) {
      expect(e).toBeInstanceOf(SimulationError);
      expect((e as SimulationError).errorName).toBe('Unauthorized');
    }
  });

  it('falls back to JSON stringified error when no Anchor log', async () => {
    const error = { Custom: 9999 };
    const connection = mockConnection({
      value: { err: error, logs: ['Program failed'] },
    });
    const tx = {} as import('@solana/web3.js').Transaction;
    try {
      await simulateTransactionOrThrow(connection as never, tx);
    } catch (e) {
      expect(e).toBeInstanceOf(SimulationError);
      expect((e as SimulationError).errorName).toContain('9999');
    }
  });
});

describe('SimulationError', () => {
  it('has correct name and message', () => {
    const err = new SimulationError('TestError', ['log line']);
    expect(err.name).toBe('SimulationError');
    expect(err.message).toContain('TestError');
    expect(err.errorName).toBe('TestError');
    expect(err.logs).toEqual(['log line']);
  });

  it('is an instance of Error', () => {
    const err = new SimulationError('TestError', []);
    expect(err instanceof Error).toBe(true);
  });
});

describe('getSimulationErrorMessage', () => {
  it('returns user-friendly message for known errors', () => {
    const err = new SimulationError('NoRewardsToClaim', []);
    const msg = getSimulationErrorMessage(err);
    expect(msg).toContain('No rewards');
  });

  it('falls back to error name for unknown errors', () => {
    const err = new SimulationError('UnknownCustomError', []);
    const msg = getSimulationErrorMessage(err);
    expect(msg).toContain('UnknownCustomError');
  });

  it('returns message for UnstakeBlockedDuringBpd', () => {
    const err = new SimulationError('UnstakeBlockedDuringBpd', []);
    const msg = getSimulationErrorMessage(err);
    expect(msg.toLowerCase()).toContain('big pay day');
  });
});
