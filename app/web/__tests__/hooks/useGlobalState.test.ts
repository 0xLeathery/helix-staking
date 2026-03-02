import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the program hook
vi.mock('@/lib/hooks/useProgram', () => ({
  useProgram: () => ({
    account: {
      globalState: {
        fetch: vi.fn().mockResolvedValue({
          totalShares: { toString: () => '1000000000000' },
          shareRate: { toString: () => '1000000000' },
          currentDay: { toString: () => '100' },
          isPaused: false,
          initSlot: { toString: () => '500000' },
        }),
      },
    },
  }),
}));

// Mock deriveGlobalState
vi.mock('@/lib/solana/pdas', () => ({
  deriveGlobalState: () => [{ toBase58: () => 'GlobalStatePDA', toBuffer: () => Buffer.alloc(32) }, 255],
  deriveMint: () => [{ toBase58: () => 'MintPDA' }, 254],
}));

import { useGlobalState } from '@/lib/hooks/useGlobalState';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useGlobalState', () => {
  it('returns isLoading=true initially', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useGlobalState(), { wrapper });
    // Initially loading
    expect(result.current.isLoading).toBe(true);
  });

  it('returns data after loading', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useGlobalState(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.totalShares).toBeDefined();
  });

  it('returns expected data shape with totalShares and shareRate', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useGlobalState(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const data = result.current.data;
    expect(data?.totalShares?.toString()).toBe('1000000000000');
    expect(data?.shareRate?.toString()).toBe('1000000000');
    expect(data?.currentDay?.toString()).toBe('100');
  });

  it('returns no error on success', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useGlobalState(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();
  });
});
