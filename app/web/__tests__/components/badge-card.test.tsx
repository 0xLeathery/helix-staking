import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BadgeCard } from '@/components/badges/badge-card';
import type { BadgeType } from '@/lib/badges/badge-types';

const baseProps = {
  badgeType: 'shrimp' as BadgeType,
  name: 'Shrimp',
  description: 'Staked 1,000+ HELIX in a single stake',
  requirement: 'Stake >= 1,000 HELIX',
  eligible: false,
  claimed: false,
  earnedAt: null,
  stakeAmount: null,
};

describe('BadgeCard - locked state', () => {
  it('renders badge name', () => {
    render(<BadgeCard {...baseProps} />);
    expect(screen.getByText('Shrimp')).toBeInTheDocument();
  });

  it('renders badge description', () => {
    render(<BadgeCard {...baseProps} />);
    expect(screen.getByText(/Staked 1,000\+ HELIX/)).toBeInTheDocument();
  });

  it('renders requirement text when locked', () => {
    render(<BadgeCard {...baseProps} eligible={false} claimed={false} />);
    expect(screen.getByText(/Stake >= 1,000 HELIX/)).toBeInTheDocument();
  });

  it('does not render Claim button when locked', () => {
    render(<BadgeCard {...baseProps} eligible={false} claimed={false} />);
    expect(screen.queryByRole('button', { name: /Claim/i })).not.toBeInTheDocument();
  });
});

describe('BadgeCard - eligible state', () => {
  it('renders Claim button when eligible', () => {
    render(<BadgeCard {...baseProps} eligible={true} claimed={false} />);
    expect(screen.getByRole('button', { name: /Claim/i })).toBeInTheDocument();
  });

  it('calls onClaim callback when Claim button is clicked', () => {
    const onClaim = vi.fn();
    render(<BadgeCard {...baseProps} eligible={true} claimed={false} onClaim={onClaim} />);
    fireEvent.click(screen.getByRole('button', { name: /Claim/i }));
    expect(onClaim).toHaveBeenCalledOnce();
  });

  it('does not render requirement text when eligible', () => {
    render(<BadgeCard {...baseProps} eligible={true} claimed={false} />);
    expect(screen.queryByText(/Stake >= 1,000 HELIX/)).not.toBeInTheDocument();
  });
});

describe('BadgeCard - claimed state', () => {
  it('shows earned date when claimed', () => {
    render(<BadgeCard {...baseProps} eligible={true} claimed={true} earnedAt="2026-01-15T00:00:00Z" />);
    expect(screen.getByText(/Claimed/i)).toBeInTheDocument();
  });

  it('shows Solscan link when claim signature provided', () => {
    render(
      <BadgeCard
        {...baseProps}
        eligible={true}
        claimed={true}
        earnedAt="2026-01-15T00:00:00Z"
        claimSignature="abc123"
      />
    );
    expect(screen.getByText(/View on Solscan/i)).toBeInTheDocument();
  });

  it('does not show Claim button when already claimed', () => {
    render(<BadgeCard {...baseProps} eligible={true} claimed={true} earnedAt="2026-01-15T00:00:00Z" />);
    expect(screen.queryByRole('button', { name: /Claim/i })).not.toBeInTheDocument();
  });
});

describe('BadgeCard - tier badge progress', () => {
  it('renders progress section for tier badge with currentMaxStake', () => {
    render(
      <BadgeCard
        {...baseProps}
        badgeType="shrimp"
        eligible={false}
        claimed={false}
        currentMaxStake="50000000000" // 500 HELIX (50% of 1000 HELIX threshold)
      />
    );
    expect(screen.getByText(/Progress/i)).toBeInTheDocument();
  });

  it('shows percentage toward threshold', () => {
    render(
      <BadgeCard
        {...baseProps}
        badgeType="shrimp"
        eligible={false}
        claimed={false}
        currentMaxStake="50000000000" // 500 HELIX = 50%
      />
    );
    expect(screen.getByText(/50%/i)).toBeInTheDocument();
  });
});

describe('BadgeCard - milestone badge', () => {
  it('renders milestone badge (first_stake)', () => {
    render(
      <BadgeCard
        {...baseProps}
        badgeType="first_stake"
        name="First Stake"
        description="Created your first HELIX stake"
        requirement="Create at least one stake"
      />
    );
    expect(screen.getByText('First Stake')).toBeInTheDocument();
  });

  it('renders 365_day milestone badge', () => {
    render(
      <BadgeCard
        {...baseProps}
        badgeType="365_day"
        name="365-Day Staker"
        description="Completed a stake of 365+ days"
        requirement="Complete a 365+ day stake"
      />
    );
    expect(screen.getByText('365-Day Staker')).toBeInTheDocument();
  });

  it('renders bpd milestone badge', () => {
    render(
      <BadgeCard
        {...baseProps}
        badgeType="bpd"
        name="Big Pay Day"
        description="Received a Big Pay Day distribution"
        requirement="Have an active stake during BPD"
      />
    );
    expect(screen.getByText('Big Pay Day')).toBeInTheDocument();
  });
});

describe('BadgeCard - all tier badge types', () => {
  const tierBadges = [
    { type: 'fish' as BadgeType, name: 'Fish' },
    { type: 'dolphin' as BadgeType, name: 'Dolphin' },
    { type: 'shark' as BadgeType, name: 'Shark' },
    { type: 'whale' as BadgeType, name: 'Whale' },
  ];

  for (const { type, name } of tierBadges) {
    it(`renders ${name} tier badge correctly`, () => {
      render(
        <BadgeCard
          {...baseProps}
          badgeType={type}
          name={name}
          description={`Staked enough for ${name}`}
          requirement={`Stake required for ${name}`}
        />
      );
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  }
});
