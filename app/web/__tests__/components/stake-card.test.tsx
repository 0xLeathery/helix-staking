import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SLOTS_PER_DAY } from '@/lib/solana/constants';

const SPD = SLOTS_PER_DAY;

// Mock useGlobalState
vi.mock('@/lib/hooks/useGlobalState', () => ({
  useGlobalState: vi.fn(() => ({
    data: {
      shareRate: new BN('1000000000'),
      initSlot: new BN(0),
      currentDay: new BN(100),
    },
    isLoading: false,
  })),
}));

import { StakeCard } from '@/components/stake/stake-card';

const STAKE_PUBKEY = new PublicKey('So11111111111111111111111111111111111111112');
const USER_PUBKEY = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(TooltipProvider, null, children)
    );
}

const activeStakeAccount = {
  user: USER_PUBKEY,
  stakeId: { toString: () => '1' },
  stakedAmount: { toString: () => '1000000000' }, // 10 HELIX
  tShares: { toString: () => '1000000000000000' },
  startSlot: { toString: () => '0' },
  endSlot: { toString: () => String(SPD * 365) }, // 365 days
  stakeDays: 365,
  rewardDebt: { toString: () => '0' },
  isActive: true,
  bpdBonusPending: { toString: () => '0' },
};

describe('StakeCard - active stake', () => {
  it('renders stake ID', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/Stake #1/i)).toBeInTheDocument();
  });

  it('renders staked amount label', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/Staked Amount/i)).toBeInTheDocument();
  });

  it('renders 10 HELIX staked amount', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/10\.00 HELIX/i)).toBeInTheDocument();
  });

  it('renders duration label', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/Duration/i)).toBeInTheDocument();
  });

  it('renders Active badge for in-progress stake', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Pending Rewards section', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/Pending Rewards/i)).toBeInTheDocument();
  });

  it('renders T-Shares section', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByText(/T-Shares/i)).toBeInTheDocument();
  });

  it('renders End Stake link button', () => {
    const wrapper = createWrapper();
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={SPD * 100}
      />,
      { wrapper }
    );
    expect(screen.getByRole('link', { name: /End Stake/i })).toBeInTheDocument();
  });
});

describe('StakeCard - matured/grace stake', () => {
  it('renders Grace Period badge when in grace period', () => {
    const wrapper = createWrapper();
    // 7 days past end = grace period
    const currentSlot = SPD * 365 + SPD * 7;
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={currentSlot}
      />,
      { wrapper }
    );
    // Grace Period may appear in both status badge and "Remaining" cell
    const gracePeriodElements = screen.getAllByText('Grace Period');
    expect(gracePeriodElements.length).toBeGreaterThan(0);
  });

  it('renders Late badge when past grace period', () => {
    const wrapper = createWrapper();
    // 30 days past end = late
    const currentSlot = SPD * 365 + SPD * 30;
    render(
      <StakeCard
        stakePublicKey={STAKE_PUBKEY}
        account={activeStakeAccount}
        currentSlot={currentSlot}
      />,
      { wrapper }
    );
    expect(screen.getByText('Late')).toBeInTheDocument();
  });
});
