import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BN from 'bn.js';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BoostBadge, getBoostState, BoostState } from '@/components/stake/boost-badge';

function renderWithTooltip(element: React.ReactElement) {
  return render(
    React.createElement(TooltipProvider, null, element)
  );
}

describe('BoostBadge - rendering', () => {
  it('renders "Boost Eligible" text for eligible state', () => {
    renderWithTooltip(<BoostBadge state="eligible" />);
    expect(screen.getByText('Boost Eligible')).toBeInTheDocument();
  });

  it('renders "Boosted" text for active state', () => {
    renderWithTooltip(<BoostBadge state="active" />);
    expect(screen.getByText('Boosted')).toBeInTheDocument();
  });

  it('renders "Boost Revoked" text for revoked state', () => {
    renderWithTooltip(<BoostBadge state="revoked" />);
    expect(screen.getByText('Boost Revoked')).toBeInTheDocument();
  });

  it('renders nothing (null) for none state', () => {
    const { container } = renderWithTooltip(<BoostBadge state="none" />);
    expect(container.firstChild).toBeNull();
  });

  it('applies amber styling for eligible state', () => {
    renderWithTooltip(<BoostBadge state="eligible" />);
    const badge = screen.getByText('Boost Eligible');
    expect(badge.className).toContain('amber');
  });

  it('applies green styling for active state', () => {
    renderWithTooltip(<BoostBadge state="active" />);
    const badge = screen.getByText('Boosted');
    expect(badge.className).toContain('green');
  });

  it('applies red styling for revoked state', () => {
    renderWithTooltip(<BoostBadge state="revoked" />);
    const badge = screen.getByText('Boost Revoked');
    expect(badge.className).toContain('red');
  });
});

describe('getBoostState - derivation logic', () => {
  it('returns "revoked" when boostRevoked is true (revoked flag takes priority)', () => {
    const account = {
      seedBalanceAtStake: new BN(1000),
      boostRevoked: true,
    };
    expect(getBoostState(account)).toBe('revoked');
  });

  it('returns "revoked" when boostRevoked is true and seedBalance is zero', () => {
    const account = {
      seedBalanceAtStake: new BN(0),
      boostRevoked: true,
    };
    expect(getBoostState(account)).toBe('revoked');
  });

  it('returns "active" when seedBalanceAtStake > 0 and not revoked', () => {
    const account = {
      seedBalanceAtStake: new BN(1000),
      boostRevoked: false,
    };
    expect(getBoostState(account)).toBe('active');
  });

  it('returns "active" when seedBalanceAtStake is large BN and not revoked', () => {
    const account = {
      seedBalanceAtStake: new BN('1000000000000'),
      boostRevoked: false,
    };
    expect(getBoostState(account)).toBe('active');
  });

  it('returns "none" when seedBalanceAtStake is 0 and not revoked', () => {
    const account = {
      seedBalanceAtStake: new BN(0),
      boostRevoked: false,
    };
    expect(getBoostState(account)).toBe('none');
  });

  it('returns "none" when seedBalanceAtStake is undefined', () => {
    const account = {};
    expect(getBoostState(account)).toBe('none');
  });

  it('returns "none" when account has no boost fields (default case)', () => {
    const account = {};
    const result: BoostState = getBoostState(account);
    expect(result).toBe('none');
  });

  it('handles string-based seedBalanceAtStake via toString()', () => {
    const account = {
      seedBalanceAtStake: { toString: () => '500' },
      boostRevoked: false,
    };
    expect(getBoostState(account)).toBe('active');
  });
});
