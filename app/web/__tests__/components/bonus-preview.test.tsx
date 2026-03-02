import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BN from 'bn.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PRECISION, LABELS } from '@/lib/solana/constants';

const { mockUseGlobalState } = vi.hoisted(() => {
  const mockUseGlobalState = vi.fn(() => ({
    data: {
      shareRate: PRECISION, // 1:1 share rate
    },
    isLoading: false,
  }));
  return { mockUseGlobalState };
});

vi.mock('@/lib/hooks/useGlobalState', () => ({
  useGlobalState: mockUseGlobalState,
}));

import { BonusPreview } from '@/components/stake/bonus-preview';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('BonusPreview', () => {
  it('renders Duration Bonus label', () => {
    const wrapper = createWrapper();
    render(<BonusPreview amount={new BN('100000000')} days={365} />, { wrapper });
    expect(screen.getByText(LABELS.LPB)).toBeInTheDocument();
  });

  it('renders Size Bonus label', () => {
    const wrapper = createWrapper();
    render(<BonusPreview amount={new BN('100000000')} days={365} />, { wrapper });
    expect(screen.getByText(LABELS.BPB)).toBeInTheDocument();
  });

  it('renders Estimated T-Shares', () => {
    const wrapper = createWrapper();
    render(<BonusPreview amount={new BN('100000000')} days={365} />, { wrapper });
    expect(screen.getByText(/Estimated/i)).toBeInTheDocument();
  });

  it('renders Total Multiplier', () => {
    const wrapper = createWrapper();
    render(<BonusPreview amount={new BN('100000000')} days={365} />, { wrapper });
    expect(screen.getByText(/Total Multiplier/i)).toBeInTheDocument();
  });

  it('shows loading skeleton when data is unavailable', () => {
    mockUseGlobalState.mockReturnValueOnce({ data: null, isLoading: true });
    const wrapper = createWrapper();
    const { container } = render(<BonusPreview amount={new BN('100000000')} days={365} />, { wrapper });
    // Skeleton divs should be present
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows 3.00x multiplier for max duration', () => {
    const wrapper = createWrapper();
    const { container } = render(<BonusPreview amount={new BN('100000000')} days={3641} />, { wrapper });
    // With max days the multiplier should be 3.00x (1x base + 2x LPB max)
    expect(container.textContent).toContain('3.00x');
  });
});
