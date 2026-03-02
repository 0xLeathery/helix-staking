import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BN from 'bn.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { mockUseStakes } = vi.hoisted(() => {
  const mockUseStakes = vi.fn(() => ({
    data: [
      {
        publicKey: { toBase58: () => 'Stake1' },
        account: {
          isActive: true,
          tShares: { toString: () => '1000000000000000' },
          rewardDebt: { toString: () => '0' },
          stakedAmount: { toString: () => '1000000000' },
        },
      },
      {
        publicKey: { toBase58: () => 'Stake2' },
        account: {
          isActive: true,
          tShares: { toString: () => '2000000000000000' },
          rewardDebt: { toString: () => '0' },
          stakedAmount: { toString: () => '2000000000' },
        },
      },
    ],
    isLoading: false,
  }));
  return { mockUseStakes };
});

vi.mock('@/lib/hooks/useStakes', () => ({
  useStakes: mockUseStakes,
}));

vi.mock('@/lib/hooks/useTokenBalance', () => ({
  useTokenBalance: vi.fn(() => ({
    data: new BN('500000000'), // 5 HELIX balance
    isLoading: false,
  })),
}));

vi.mock('@/lib/hooks/useGlobalState', () => ({
  useGlobalState: vi.fn(() => ({
    data: {
      shareRate: new BN('1000000000'), // 1e9
    },
    isLoading: false,
  })),
}));

import { PortfolioSummary } from '@/components/dashboard/portfolio-summary';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('PortfolioSummary - with stakes', () => {
  it('renders Portfolio Summary heading', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/Portfolio Summary/i)).toBeInTheDocument();
  });

  it('renders wallet balance', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/Wallet Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.00 HELIX/i)).toBeInTheDocument();
  });

  it('renders active stake count', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/Active Stakes/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders Total T-Shares', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/Total/i)).toBeInTheDocument();
    expect(screen.getByText(/T-Shares/i)).toBeInTheDocument();
  });

  it('renders Pending Rewards', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/Pending Rewards/i)).toBeInTheDocument();
  });

  it('renders New Stake button', () => {
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByRole('link', { name: /New Stake/i })).toBeInTheDocument();
  });
});

describe('PortfolioSummary - empty state', () => {
  it('renders empty state message when no active stakes', () => {
    mockUseStakes.mockReturnValueOnce({ data: [], isLoading: false });
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByText(/No active stakes/i)).toBeInTheDocument();
  });

  it('renders Create Stake button in empty state', () => {
    mockUseStakes.mockReturnValueOnce({ data: [], isLoading: false });
    const wrapper = createWrapper();
    render(<PortfolioSummary />, { wrapper });
    expect(screen.getByRole('link', { name: /Create Stake/i })).toBeInTheDocument();
  });
});
