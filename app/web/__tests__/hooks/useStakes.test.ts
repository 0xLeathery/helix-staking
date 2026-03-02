import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockStakes = [
  {
    publicKey: { toBase58: () => 'StakePDA1', toBuffer: () => Buffer.alloc(32) },
    account: {
      isActive: true,
      stakeId: { toString: () => '0' },
      stakedAmount: { toString: () => '100000000' },
      tShares: { toString: () => '100000000000000' },
      startSlot: { toString: () => '0' },
      endSlot: { toString: () => '216000000' },
      stakeDays: 1000,
      rewardDebt: { toString: () => '0' },
      bpdBonusPending: { toString: () => '0' },
      user: { toBase58: () => 'UserPubkey' },
    },
  },
];

// Mock wallet with connected public key
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: { toBase58: () => 'UserPubkey', toBuffer: () => Buffer.alloc(32) },
    connected: true,
  }),
  useConnection: () => ({
    connection: {
      onAccountChange: vi.fn(() => 1),
      removeAccountChangeListener: vi.fn(),
    },
  }),
}));

// Mock the program hook
vi.mock('@/lib/hooks/useProgram', () => ({
  useProgram: () => ({
    account: {
      stakeAccount: {
        all: vi.fn().mockResolvedValue(mockStakes),
      },
    },
  }),
}));

import { useStakes } from '@/lib/hooks/useStakes';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useStakes', () => {
  it('returns isLoading=true initially when wallet connected', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useStakes(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns stake list after loading', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useStakes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });

  it('returns stakes with expected structure', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useStakes(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const stakes = result.current.data;
    expect(stakes?.length).toBeGreaterThan(0);
    expect(stakes?.[0].account.isActive).toBe(true);
  });
});
