import { describe, it, expect, vi, beforeAll } from 'vitest';
import { PublicKey } from '@solana/web3.js';

// Mock ComputeBudgetProgram before importing to avoid Buffer issues in jsdom
vi.mock('@solana/web3.js', async () => {
  const actual = await vi.importActual<typeof import('@solana/web3.js')>('@solana/web3.js');
  const COMPUTE_BUDGET_ID = new actual.PublicKey('ComputeBudget111111111111111111111111111111');
  return {
    ...actual,
    ComputeBudgetProgram: {
      programId: COMPUTE_BUDGET_ID,
      setComputeUnitLimit: ({ units }: { units: number }) => ({
        programId: COMPUTE_BUDGET_ID,
        keys: [],
        data: Buffer.from([2, units & 0xff, (units >> 8) & 0xff, (units >> 16) & 0xff, (units >> 24) & 0xff]),
      }),
      setComputeUnitPrice: ({ microLamports }: { microLamports: number }) => ({
        programId: COMPUTE_BUDGET_ID,
        keys: [],
        data: Buffer.from([3, microLamports & 0xff]),
      }),
    },
  };
});

describe('getComputeBudgetInstructions', () => {
  it('returns exactly 2 instructions', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const instructions = getComputeBudgetInstructions(200_000);
    expect(instructions).toHaveLength(2);
  });

  it('uses the ComputeBudget program ID', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const computeBudgetProgramId = 'ComputeBudget111111111111111111111111111111';
    const instructions = getComputeBudgetInstructions(200_000);
    for (const ix of instructions) {
      expect(ix.programId.toBase58()).toBe(computeBudgetProgramId);
    }
  });

  it('first instruction is setComputeUnitLimit (discriminator 0x02)', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const instructions = getComputeBudgetInstructions(200_000, 50_000);
    expect(instructions[0].data[0]).toBe(2);
  });

  it('second instruction is setComputeUnitPrice (discriminator 0x03)', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const instructions = getComputeBudgetInstructions(200_000, 50_000);
    expect(instructions[1].data[0]).toBe(3);
  });

  it('uses default priority fee when not specified', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const instructions = getComputeBudgetInstructions(200_000);
    expect(instructions).toHaveLength(2);
    expect(instructions[1].data[0]).toBe(3);
  });

  it('accepts custom priority fee', async () => {
    const { getComputeBudgetInstructions } = await import('@/lib/solana/compute-budget');
    const instructions = getComputeBudgetInstructions(100_000, 100_000);
    expect(instructions).toHaveLength(2);
  });
});

describe('CU_LIMITS', () => {
  it('defines compute unit limits for all instructions', async () => {
    const { CU_LIMITS } = await import('@/lib/solana/compute-budget');
    expect(CU_LIMITS.createStake).toBeGreaterThan(0);
    expect(CU_LIMITS.createStakeWithReferral).toBeGreaterThan(CU_LIMITS.createStake);
    expect(CU_LIMITS.unstake).toBeGreaterThan(0);
    expect(CU_LIMITS.claimRewards).toBeGreaterThan(0);
    expect(CU_LIMITS.freeClaim).toBeGreaterThan(0);
    expect(CU_LIMITS.crankDistribution).toBeGreaterThan(0);
    expect(CU_LIMITS.triggerBigPayDay).toBeGreaterThan(0);
    expect(CU_LIMITS.finalizeBpd).toBeGreaterThan(0);
    expect(CU_LIMITS.claimBadge).toBeGreaterThan(0);
  });
});
