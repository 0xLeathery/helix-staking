import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

// ---------------------------------------------------------------------------
// Module-level mocks (hoisted)
// ---------------------------------------------------------------------------

const mockGlobalStatePda = PublicKey.default;
const mockBoostRecordPda = new PublicKey('GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw');
const mockSeedMint = new PublicKey('SeedTokenMintXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
const mockUserPubkey = new PublicKey('HeLiX5s3FqBRCiPCdXqRFxgWvDdJHr9bP5kQ3L1KWKL');

// Mock pdas
vi.mock('@/lib/solana/pdas', () => ({
  deriveGlobalState: vi.fn(() => [mockGlobalStatePda, 255]),
  deriveBoostRecord: vi.fn(() => [mockBoostRecordPda, 255]),
}));

// Mock compute-budget
vi.mock('@/lib/solana/compute-budget', () => ({
  getComputeBudgetInstructions: vi.fn(() => []),
  CU_LIMITS: { createStake: 200_000 },
}));

// Mock useSeedBalance's exported getSeedMintFromGlobalState
vi.mock('@/lib/hooks/useSeedBalance', () => ({
  getSeedMintFromGlobalState: vi.fn(() => mockSeedMint),
  useSeedBalance: vi.fn(),
}));

// Mock @solana/spl-token
const mockSeedAta = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
vi.mock('@solana/spl-token', () => ({
  getAssociatedTokenAddressSync: vi.fn(() => mockSeedAta),
}));

// ---------------------------------------------------------------------------
// Import buildRegisterBoostTx after mocks are set up
// ---------------------------------------------------------------------------
import { buildRegisterBoostTx } from '@/lib/hooks/useRegisterBoost';
import { getSeedMintFromGlobalState } from '@/lib/hooks/useSeedBalance';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SPL_TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

function makeMockProgram({
  globalStateData = { reserved: Array(10).fill(new BN(0)) },
  tx = new Transaction(),
}: {
  globalStateData?: object;
  tx?: Transaction;
} = {}) {
  const transactionFn = vi.fn().mockResolvedValue(tx);
  const accountsPartialFn = vi.fn().mockReturnValue({ transaction: transactionFn });
  const registerSeedBoostFn = vi.fn().mockReturnValue({ accountsPartial: accountsPartialFn });

  return {
    account: {
      globalState: {
        fetch: vi.fn().mockResolvedValue(globalStateData),
      },
    },
    methods: {
      registerSeedBoost: registerSeedBoostFn,
    },
    _registerSeedBoostFn: registerSeedBoostFn,
    _accountsPartialFn: accountsPartialFn,
    _transactionFn: transactionFn,
  };
}

function makeMockConnection({
  simulateErr = null,
  blockhash = 'abc123',
  lastValidBlockHeight = 100,
}: {
  simulateErr?: object | null;
  blockhash?: string;
  lastValidBlockHeight?: number;
} = {}) {
  return {
    simulateTransaction: vi.fn().mockResolvedValue({ value: { err: simulateErr, logs: [] } }),
    getLatestBlockhash: vi.fn().mockResolvedValue({ blockhash, lastValidBlockHeight }),
    confirmTransaction: vi.fn().mockResolvedValue({}),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildRegisterBoostTx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset getSeedMintFromGlobalState to return valid mint by default
    vi.mocked(getSeedMintFromGlobalState).mockReturnValue(mockSeedMint);
  });

  it('throws "Wallet not connected" when publicKey is null', async () => {
    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn();

    await expect(
      buildRegisterBoostTx({
        publicKey: null,
        program: program as any,
        connection: connection as any,
        sendTransaction,
      })
    ).rejects.toThrow('Wallet not connected');
  });

  it('throws "Seed mint not configured" when getSeedMintFromGlobalState returns PublicKey.default', async () => {
    vi.mocked(getSeedMintFromGlobalState).mockReturnValue(PublicKey.default);

    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn();

    await expect(
      buildRegisterBoostTx({
        publicKey: mockUserPubkey,
        program: program as any,
        connection: connection as any,
        sendTransaction,
      })
    ).rejects.toThrow('Seed mint not configured');
  });

  it('calls registerSeedBoost with correct accounts', async () => {
    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn().mockResolvedValue('sig123');

    await buildRegisterBoostTx({
      publicKey: mockUserPubkey,
      program: program as any,
      connection: connection as any,
      sendTransaction,
    });

    expect(program._registerSeedBoostFn).toHaveBeenCalledTimes(1);
    const accountsArg = program._accountsPartialFn.mock.calls[0][0];
    expect(accountsArg.user.toBase58()).toBe(mockUserPubkey.toBase58());
    expect(accountsArg.globalState.toBase58()).toBe(mockGlobalStatePda.toBase58());
    expect(accountsArg.boostRecord.toBase58()).toBe(mockBoostRecordPda.toBase58());
    expect(accountsArg.seedTokenAccount.toBase58()).toBe(mockSeedAta.toBase58());
    expect(accountsArg.seedMint.toBase58()).toBe(mockSeedMint.toBase58());
    // seedTokenProgram should be the standard SPL Token program ID
    expect(accountsArg.seedTokenProgram.toBase58()).toBe(SPL_TOKEN_PROGRAM_ID);
  });

  it('simulates transaction before sending', async () => {
    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn().mockResolvedValue('sig123');

    await buildRegisterBoostTx({
      publicKey: mockUserPubkey,
      program: program as any,
      connection: connection as any,
      sendTransaction,
    });

    // simulateTransaction must be called before sendTransaction
    const simulateCallOrder = connection.simulateTransaction.mock.invocationCallOrder[0];
    const sendCallOrder = sendTransaction.mock.invocationCallOrder[0];
    expect(simulateCallOrder).toBeLessThan(sendCallOrder);
  });

  it('uses standard SPL Token program ID for seed ATA derivation (not Token-2022)', async () => {
    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn().mockResolvedValue('sig123');

    await buildRegisterBoostTx({
      publicKey: mockUserPubkey,
      program: program as any,
      connection: connection as any,
      sendTransaction,
    });

    const getAtaCall = vi.mocked(getAssociatedTokenAddressSync).mock.calls[0];
    // Fourth argument (index 3) is programId (token program)
    // getAssociatedTokenAddressSync(mint, owner, allowOwnerOffCurve, programId?, associatedTokenProgramId?)
    const tokenProgramIdArg = getAtaCall[3] as PublicKey;
    expect(tokenProgramIdArg.toBase58()).toBe(SPL_TOKEN_PROGRAM_ID);
  });

  it('returns signature on success', async () => {
    const program = makeMockProgram();
    const connection = makeMockConnection();
    const sendTransaction = vi.fn().mockResolvedValue('sig_abc');

    const result = await buildRegisterBoostTx({
      publicKey: mockUserPubkey,
      program: program as any,
      connection: connection as any,
      sendTransaction,
    });

    expect(result).toEqual({ signature: 'sig_abc' });
  });
});
