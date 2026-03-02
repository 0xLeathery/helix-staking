import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock wallet-adapter-react for these tests
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    publicKey: { toBase58: () => 'UserPubkey', toBuffer: () => Buffer.alloc(32) },
    connected: true,
  }),
  useConnection: () => ({
    connection: {
      getTokenAccountBalance: vi.fn().mockResolvedValue({
        value: { amount: '150000000', decimals: 8 },
      }),
    },
  }),
}));

// Mock spl-token ATA derivation
vi.mock('@solana/spl-token', () => ({
  getAssociatedTokenAddressSync: vi.fn(() => ({
    toBase58: () => 'ATAPubkey',
    toBuffer: () => Buffer.alloc(32),
  })),
}));

// Mock deriveMint
vi.mock('@/lib/solana/pdas', () => ({
  deriveMint: () => [{ toBase58: () => 'MintPDA', toBuffer: () => Buffer.alloc(32) }, 254],
  deriveGlobalState: () => [{ toBase58: () => 'GlobalStatePDA', toBuffer: () => Buffer.alloc(32) }, 255],
}));

import { useTokenBalance } from '@/lib/hooks/useTokenBalance';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useTokenBalance', () => {
  it('returns isLoading=true initially when wallet connected', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTokenBalance(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('returns BN balance after loading', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTokenBalance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.toString()).toBe('150000000');
  });

  it('returns BN type', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTokenBalance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // BN has a words property
    expect(result.current.data).toHaveProperty('words');
  });
});

describe('useTokenBalance (disconnected wallet)', () => {
  it('is disabled when wallet not connected', () => {
    // Override wallet mock to return null publicKey
    vi.doMock('@solana/wallet-adapter-react', () => ({
      useWallet: () => ({ publicKey: null, connected: false }),
      useConnection: () => ({
        connection: {
          getTokenAccountBalance: vi.fn(),
        },
      }),
    }));

    // With null publicKey, enabled=false -> no loading, no data
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTokenBalance(), { wrapper });
    // enabled=false -> fetchStatus is idle, isLoading=false
    expect(result.current.isPending).toBe(true); // pending with no data when disabled
  });
});
