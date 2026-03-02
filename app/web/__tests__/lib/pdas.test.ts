// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  deriveGlobalState,
  deriveMint,
  deriveMintAuthority,
  deriveStakeAccount,
  deriveClaimConfig,
  deriveReferralRecord,
} from '@/lib/solana/pdas';

const USER_1 = new PublicKey('So11111111111111111111111111111111111111112');
const USER_2 = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

describe('deriveGlobalState', () => {
  it('returns a [PublicKey, bump] tuple', () => {
    const [pda, bump] = deriveGlobalState();
    expect(pda instanceof PublicKey).toBe(true);
    expect(typeof bump).toBe('number');
    expect(bump).toBeGreaterThanOrEqual(0);
    expect(bump).toBeLessThanOrEqual(255);
  });

  it('returns consistent result on repeated calls', () => {
    const [pda1] = deriveGlobalState();
    const [pda2] = deriveGlobalState();
    expect(pda1.equals(pda2)).toBe(true);
  });
});

describe('deriveMint', () => {
  it('returns a valid PDA', () => {
    const [pda, bump] = deriveMint();
    expect(pda instanceof PublicKey).toBe(true);
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('is different from GlobalState PDA', () => {
    const [globalStatePda] = deriveGlobalState();
    const [mintPda] = deriveMint();
    expect(globalStatePda.equals(mintPda)).toBe(false);
  });

  it('returns consistent result', () => {
    const [pda1] = deriveMint();
    const [pda2] = deriveMint();
    expect(pda1.equals(pda2)).toBe(true);
  });
});

describe('deriveMintAuthority', () => {
  it('returns a valid PDA', () => {
    const [pda, bump] = deriveMintAuthority();
    expect(pda instanceof PublicKey).toBe(true);
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('is different from Mint PDA', () => {
    const [mintPda] = deriveMint();
    const [authorityPda] = deriveMintAuthority();
    expect(mintPda.equals(authorityPda)).toBe(false);
  });
});

describe('deriveStakeAccount', () => {
  it('returns a valid PDA for user and stake ID', () => {
    const [pda, bump] = deriveStakeAccount(USER_1, 0);
    expect(pda instanceof PublicKey).toBe(true);
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('is consistent for same inputs', () => {
    const [pda1] = deriveStakeAccount(USER_1, 0);
    const [pda2] = deriveStakeAccount(USER_1, 0);
    expect(pda1.equals(pda2)).toBe(true);
  });

  it('produces different PDA for different stake IDs', () => {
    const [pda1] = deriveStakeAccount(USER_1, 0);
    const [pda2] = deriveStakeAccount(USER_1, 1);
    expect(pda1.equals(pda2)).toBe(false);
  });

  it('produces different PDA for different users', () => {
    const [pda1] = deriveStakeAccount(USER_1, 0);
    const [pda2] = deriveStakeAccount(USER_2, 0);
    expect(pda1.equals(pda2)).toBe(false);
  });

  it('accepts BN stake ID', () => {
    const [pdaNum] = deriveStakeAccount(USER_1, 5);
    const [pdaBN] = deriveStakeAccount(USER_1, new BN(5));
    expect(pdaNum.equals(pdaBN)).toBe(true);
  });
});

describe('deriveClaimConfig', () => {
  it('returns a valid PDA', () => {
    const [pda, bump] = deriveClaimConfig();
    expect(pda instanceof PublicKey).toBe(true);
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('returns consistent result', () => {
    const [pda1] = deriveClaimConfig();
    const [pda2] = deriveClaimConfig();
    expect(pda1.equals(pda2)).toBe(true);
  });
});

describe('deriveReferralRecord', () => {
  it('returns a valid PDA for referrer and referee', () => {
    const [pda, bump] = deriveReferralRecord(USER_1, USER_2);
    expect(pda instanceof PublicKey).toBe(true);
    expect(bump).toBeGreaterThanOrEqual(0);
  });

  it('returns consistent result for same inputs', () => {
    const [pda1] = deriveReferralRecord(USER_1, USER_2);
    const [pda2] = deriveReferralRecord(USER_1, USER_2);
    expect(pda1.equals(pda2)).toBe(true);
  });

  it('produces different PDA when referrer and referee are swapped', () => {
    const [pda1] = deriveReferralRecord(USER_1, USER_2);
    const [pda2] = deriveReferralRecord(USER_2, USER_1);
    expect(pda1.equals(pda2)).toBe(false);
  });
});
