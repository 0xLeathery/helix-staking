import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const { mockUseWallet, mockUseReferralStats } = vi.hoisted(() => {
  const mockUseWallet = vi.fn(() => ({
    publicKey: {
      toBase58: () => 'So11111111111111111111111111111111111111112',
    },
    connected: true,
  }));
  const mockUseReferralStats = vi.fn(() => ({
    data: {
      totalReferrals: 3,
      totalReferrerBonusTokens: '500000000', // 5 HELIX
    },
    isLoading: false,
  }));
  return { mockUseWallet, mockUseReferralStats };
});

vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: mockUseWallet,
  useConnection: () => ({
    connection: {
      onAccountChange: vi.fn(() => 1),
      removeAccountChangeListener: vi.fn(),
    },
  }),
}));

vi.mock('@/lib/hooks/useReferralStats', () => ({
  useReferralStats: mockUseReferralStats,
}));

// Mock clipboard
Object.defineProperty(globalThis.navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  writable: true,
});

import { ReferralStatsPanel } from '@/components/dashboard/referral-stats-panel';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('ReferralStatsPanel - connected wallet', () => {
  it('renders Referral Program heading', () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    expect(screen.getByText(/Referral Program/i)).toBeInTheDocument();
  });

  it('renders referral link input with ref= param', () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toContain('ref=');
  });

  it('renders Copy button', () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    expect(screen.getByRole('button', { name: /Copy/i })).toBeInTheDocument();
  });

  it('renders total referrals count', () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    expect(screen.getByText(/Total Referrals/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders bonus earned section', () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    expect(screen.getByText(/Bonus Earned/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.00 HELIX/i)).toBeInTheDocument();
  });

  it('copies referral link on Copy button click', async () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    const copyBtn = screen.getByRole('button', { name: /Copy/i });
    fireEvent.click(copyBtn);
    await waitFor(() => {
      expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });

  it('shows Copied! text after copy', async () => {
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /Copy/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Copied!/i })).toBeInTheDocument();
    });
  });
});

describe('ReferralStatsPanel - no referrals', () => {
  it('renders 0 when no referrals', () => {
    mockUseReferralStats.mockReturnValueOnce({
      data: { totalReferrals: 0, totalReferrerBonusTokens: '0' },
      isLoading: false,
    });
    const wrapper = createWrapper();
    render(<ReferralStatsPanel />, { wrapper });
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

describe('ReferralStatsPanel - disconnected wallet', () => {
  it('renders nothing when wallet not connected', () => {
    mockUseWallet.mockReturnValueOnce({ publicKey: null, connected: false });
    const wrapper = createWrapper();
    const { container } = render(<ReferralStatsPanel />, { wrapper });
    expect(container.firstChild).toBeNull();
  });
});
